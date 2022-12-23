import React, {useEffect, useState} from "react";
import {ScrollView, Text} from "react-native";
import {APP_ID, APP_TOKEN} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";
import PillButton from "../components/buttons/PillButton";
import WelcomeModal from "../components/modals/WelcomeModal";
import {Button, Card} from "react-native-paper";
import Drugs from "../components/content/Drugs";

function Home({navigation, route}) {
    const {userId, logged, token} = route.params;
    const [isLogged, setIsLogged] = useState(logged);
    const [loading, setLoading] = useState(false);
    const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
    const [drugList, setDrugList] = useState([]);
    const [drugsVisible, setDrugsVisible] = useState(true);
    const [refreshBtnLoading, setRefreshBtnLoading] = useState(false);

    // if user checked earlier checkbox in modal
    const checkIfWelcomeMsgShouldBeVisible = async () => await AsyncStorage.getItem('welcome_msg_disable');

    const getDrugList = async () => {
        await ajaxCall('get', `drug-notify/${token}`)
            .then(data => {
                setDrugsVisible(false);
                setDrugList(data);
                setDrugsVisible(true);
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
        const drugListInterval = setInterval(getDrugList, 5000);
        checkIfWelcomeMsgShouldBeVisible().then(msgDisabled => {
            if (msgDisabled) {
                setWelcomeModalVisible(false);
            } else {
                setWelcomeModalVisible(true);
            }
        });

        return () => clearInterval(drugListInterval);
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

    // useEffect(() => {
    //     async function sendNotificationAfterLogin() {
    //         await fetch('https://app.nativenotify.com/api/indie/notification', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 subID: userId,
    //                 appId: APP_ID,
    //                 appToken: APP_TOKEN,
    //                 title: 'Login success',
    //                 message: 'Pomyślnie zalogowano'
    //             })
    //         });
    //     }
    //     sendNotificationAfterLogin();
    // }, []);

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
                    {drugsVisible && <Drugs drugList={drugList}/>}
                    <Button
                        testID="refreshBtn"
                        style={{backgroundColor: '#78c2ad'}}
                        mode="contained"
                        icon="refresh"
                        onPress={async () => {
                            setDrugsVisible(false);
                            setRefreshBtnLoading(true);
                            await getDrugList();
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