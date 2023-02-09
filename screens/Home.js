import React, {useContext, useEffect, useMemo, useState} from "react";
import {ScrollView, Text} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";
import PillButton from "../components/buttons/PillButton";
import WelcomeModal from "../components/modals/WelcomeModal";
import {ActivityIndicator, Button, Card, Colors} from "react-native-paper";
import Drugs from "../components/content/Drugs";
import DrugTakenContext from "../context/DrugTakenContext";
import {TimeContext} from "../context/TimeContext";
import dayjs from "dayjs";
import sendNotification from "../utils/notifier";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function Home({navigation, route}) {
    const [drugTakenChecker, setDrugTakenChecker] = useState([]); // Array for storing strings associated
    // with dosing moment keys -> if user clicks confirmation button, key will be pushed to the array, so thanks to it
    // dosing moment won't be rendered again later

    const {userId, logged, token} = route.params;
    const {currentTime, setCurrentTime} = useContext(TimeContext);
    const [isLogged, setIsLogged] = useState(logged);
    const [loading, setLoading] = useState(false);
    const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
    const [drugList, setDrugList] = useState([]);
    const [drugsVisible, setDrugsVisible] = useState(false);
    const [refreshBtnLoading, setRefreshBtnLoading] = useState(false);
    const [sentNotifications, setSentNotifications] = useState([]); // For sent notifications ids

    const drugTakenContextValue = useMemo(
        () => ({drugTakenChecker, setDrugTakenChecker}),
        [drugTakenChecker]
    );

    // if user checked earlier checkbox in modal
    const checkIfWelcomeMsgShouldBeVisible = async () => await AsyncStorage.getItem('welcome_msg_disable');

    const getTomorrowTimeFromLocalStorage = async () => await AsyncStorage.getItem('tomorrow_time');
    const saveTomorrowTimeToLocalStorage = async () => {
        await AsyncStorage.setItem(
            'tomorrow_time', JSON.stringify(
                dayjs()
                    .add(1, 'd')
                    .startOf('d')
            )
        ); // Midnight
    };

    const getDrugTakenCheckerFromLocalStorage = async () => await AsyncStorage.getItem('drugTakenChecker');

    const updateCurrentTime = () => setCurrentTime(dayjs());

    const getDrugListAndSendNotification = async () => {
        await ajaxCall('get', `drug-notify/${token}`)
            .then(data => {
                setDrugsVisible(false);
                setDrugList(data);
                setDrugsVisible(true);
                // Check dosing time and send notification in suitable time
                drugList.forEach(async drug => {
                    const dosingMoments = Object.entries(drug.dosingMoments);
                    for (const [key, value] of dosingMoments) {
                        const drugTakenIdentifier = `${drug.name}_${key}`; // Used also as id of sent notification (no idea for other variable's name :) )
                        if (drugTakenChecker.find(string => string === drugTakenIdentifier)) {
                            continue;
                        }

                        const [hour, minutes] = value.split(':');
                        const dosingDateTime = dayjs().hour(hour).minute(minutes);
                        if (currentTime.isSameOrAfter(dosingDateTime) && sentNotifications.indexOf(drugTakenIdentifier) === -1) {
                            await sendNotification(drug.name, drug.dosing, drug.unit, userId);
                            const sentNotificationsNewValue = [...sentNotifications, drugTakenIdentifier];
                            setSentNotifications(sentNotificationsNewValue);
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    // block going back until user pushed logout button
    navigation.addListener('beforeRemove', e => {
        if (!isLogged) {
            navigation.dispatch(e.data.action); // unblock going back action
            return;
        }
        e.preventDefault();
    });

    useEffect(() => {
        if (!isLogged) {
            navigation.navigate('Login');
        }
    }, [isLogged]);

    useEffect(() => {
        const updateTimeInterval = setInterval(updateCurrentTime, 1000);

        getTomorrowTimeFromLocalStorage().then(async tomorrowTimeStr => {
            if (tomorrowTimeStr) {
                const tomorrowTimeParsed = dayjs(JSON.parse(tomorrowTimeStr));
                if (currentTime.isSameOrAfter(tomorrowTimeParsed)) {
                    await saveTomorrowTimeToLocalStorage();
                    await AsyncStorage.removeItem('drugTakenChecker');
                }
            } else {
                await saveTomorrowTimeToLocalStorage();
            }
        }).catch(err => {
            console.log(err);
        });

        getDrugTakenCheckerFromLocalStorage().then(value => {
            if (value) {
                setDrugTakenChecker(JSON.parse(value));
            }
        });

        checkIfWelcomeMsgShouldBeVisible().then(msgDisabled => {
            if (msgDisabled) {
                setWelcomeModalVisible(false);
            } else {
                setWelcomeModalVisible(true);
            }
        }).catch(err => {
            console.log(err);
        });

        const drugListInterval = setInterval(getDrugListAndSendNotification, 5000);

        return () => {
            clearInterval(drugListInterval);
            clearInterval(updateTimeInterval);
        };
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        await ajaxCall('post', 'logout', {userId})
            .then(async data => {
                console.log(data);
                if (data.status === 200) {
                    await AsyncStorage.clear();
                    setIsLogged(false);
                }
            })
            .catch(err => {
                console.log(err);
            });
        setLoading(false);
    };

    return (
        <ScrollView>
            <Text style={{
                fontSize: 32,
                fontWeight: "500",
                marginTop: 10,
                textAlign: "center"
            }}>
                Monitorowanie rozpoczęte 👁
            </Text>
            <Card style={{alignContent: "center", margin: 10, marginBottom: 20}}>
                <Card.Title
                    title="W najbliższym czasie muszę zażyć:"
                    titleStyle={{
                        color: "#252525",
                        textAlign: "center"
                    }}
                />
                <Card.Content>
                    {
                        drugsVisible
                            ?
                            <DrugTakenContext.Provider value={drugTakenContextValue}>
                                <Drugs drugList={drugList}/>
                            </DrugTakenContext.Provider>
                            :
                            <ActivityIndicator
                                animating={true}
                                size="large"
                                style={{marginBottom: 10}}
                                color={Colors.lightBlueA100}
                            />
                    }
                    <Button
                        testID="refreshBtn"
                        style={{backgroundColor: '#78c2ad'}}
                        mode="contained"
                        icon="refresh"
                        onPress={async () => {
                            setDrugsVisible(false);
                            setRefreshBtnLoading(true);
                            await getDrugListAndSendNotification();
                            setDrugsVisible(true);
                            setRefreshBtnLoading(false);
                        }}
                        loading={refreshBtnLoading}
                    >
                        Odśwież
                    </Button>
                </Card.Content>
            </Card>
            {welcomeModalVisible && <WelcomeModal/>}
            <PillButton handlePress={handleLogout} loading={loading} variant="warning" text="Wyloguj się"/>
        </ScrollView>
    );
}

export default Home;