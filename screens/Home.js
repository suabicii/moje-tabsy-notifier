import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {APP_ID, APP_TOKEN} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";
import PillButton from "../components/buttons/PillButton";
import WelcomeModal from "../components/modals/WelcomeModal";

function Home({navigation, route}) {
    const {userId, logged, token} = route.params;
    const [isLogged, setIsLogged] = useState(logged);
    const [loading, setLoading] = useState(false);
    const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
    const [drugList, setDrugList] = useState([]);

    // if user checked earlier checkbox in modal
    const checkIfWelcomeMsgShouldBeVisible = async () => await AsyncStorage.getItem('welcome_msg_disable');

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
        checkIfWelcomeMsgShouldBeVisible().then(msgDisabled => {
            if (msgDisabled) {
                setWelcomeModalVisible(false);
            } else {
                setWelcomeModalVisible(true);
            }
        });
        setInterval(async () => {
            await ajaxCall('get', `drug-notify/${token}`)
                .then(data => {
                    setDrugList(data);
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                });
        }, 300000);
    }, []);

    // useEffect(() => {
    //     drugList.forEach(({dosing, dosingMoments, name, unit}) => {
    //         for (const key in dosingMoments) {
    //             if (dosingMoments.hasOwnProperty(key)) {
    //                 console.log(`Weź ${name} ${dosing} ${unit} o godz. ${dosingMoments[key]}`);
    //             }
    //         }
    //     });
    // }, [drugList]);

    const handleLogout = async () => {
        setLoading(true);
        await ajaxCall('post', 'logout', {userId})
            .then(async data => {
                console.log(data);
                if (data.status === 200) {
                    setIsLogged(false);
                }
                await AsyncStorage.clear();
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
        <View style={{flex: 1, justifyContent: "space-between"}}>
            <Text style={{
                fontSize: 32,
                fontWeight: "500",
                marginTop: 10,
                textAlign: "center"
            }}>
                Monitorowanie rozpoczęte 👁
            </Text>
            {welcomeModalVisible && <WelcomeModal isVisible={welcomeModalVisible}/>}
            <PillButton handlePress={handleLogout} loading={loading} variant="warning" text="Wyloguj się"/>
        </View>
    );
}

export default Home;