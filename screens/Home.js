import React, {useEffect, useState} from "react";
import {ScrollView, Text} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";
import PillButton from "../components/buttons/PillButton";
import WelcomeModal from "../components/modals/WelcomeModal";
import {ActivityIndicator, Button, Card, Colors} from "react-native-paper";
import Drugs from "../components/content/Drugs";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentTime, setTomorrowTime} from "../features/time/timeSlice";
import {fetchDrugs} from "../features/drugs/drugsSlice";
import {setDrugsTaken} from "../features/drugsTaken/drugsTakenSlice";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function Home({navigation, route}) {
    const {userId, logged, token} = route.params;

    const time = useSelector(state => state.time);
    const drugList = useSelector(state => state.drugs);
    const dispatch = useDispatch();

    const [isLogged, setIsLogged] = useState(logged);
    const [loading, setLoading] = useState(false);
    const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
    const [drugsVisible, setDrugsVisible] = useState(false);
    const [refreshBtnLoading, setRefreshBtnLoading] = useState(false);

    // if user checked earlier checkbox in modal
    const checkIfWelcomeMsgShouldBeVisible = async () => await AsyncStorage.getItem('welcome_msg_disable');

    const getTomorrowTimeFromLocalStorage = async () => await AsyncStorage.getItem('tomorrow_time');
    const saveTomorrowTime = async () => {
        const tomorrowTime = dayjs().add(1, 'd').startOf('d'); // Midnight
        const tomorrowTimeJSON = JSON.stringify(tomorrowTime);
        dispatch(setTomorrowTime(tomorrowTimeJSON));
        await AsyncStorage.setItem('tomorrow_time', tomorrowTimeJSON);
    };

    const getDrugsTakenFromLocalStorage = async () => await AsyncStorage.getItem('drugs_taken');

    const updateCurrentTime = () => {
        const currentTimeJSON = JSON.stringify(dayjs());
        dispatch(setCurrentTime(currentTimeJSON));
    };

    const getDrugList = async () => {
        setDrugsVisible(false);
        dispatch(fetchDrugs(token));
        setDrugsVisible(true);
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
        getTomorrowTimeFromLocalStorage().then(async tomorrowTimeStr => {
            if (tomorrowTimeStr) {
                const currentTimeParsed = dayjs(JSON.parse(time.now));
                const tomorrowTimeParsed = dayjs(JSON.parse(tomorrowTimeStr));
                dispatch(setTomorrowTime(tomorrowTimeStr));
                if (currentTimeParsed.isSameOrAfter(tomorrowTimeParsed)) {
                    await saveTomorrowTime();
                    await AsyncStorage.removeItem('drugs_taken');
                }
            } else {
                await saveTomorrowTime();
            }

            await getDrugsTakenFromLocalStorage().then(value => {
                if (value) {
                    dispatch(setDrugsTaken(JSON.parse(value)));
                }
            });
        }).catch(err => {
            console.log(err);
        });

        const updateCurrentTimeInterval = setInterval(updateCurrentTime, 1000);

        checkIfWelcomeMsgShouldBeVisible().then(msgDisabled => {
            if (msgDisabled) {
                setWelcomeModalVisible(false);
            } else {
                setWelcomeModalVisible(true);
            }
        }).catch(err => {
            console.log(err);
        });

        const drugListInterval = setInterval(getDrugList, 5000);

        return () => {
            clearInterval(drugListInterval);
            clearInterval(updateCurrentTimeInterval);
        };
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        await ajaxCall('post', 'logout', {body: {userId}})
            .then(async data => {
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
                            <Drugs drugList={drugList}/>
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
                        onPress={() => {
                            setRefreshBtnLoading(true);
                            setTimeout(async () => {
                                await getDrugList();
                                setRefreshBtnLoading(false);
                            }, 500);
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