import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {APP_ID, APP_TOKEN} from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";

function Home({navigation, route}) {
    const {userId, logged} = route.params;
    const [isLogged, setIsLogged] = useState(logged);
    const [loading, setLoading] = useState(false);

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
        <View style={{flex: 1, justifyContent: "center"}}>
            <Text style={{
                fontSize: 32,
                fontWeight: "500",
                textAlign: "center"
            }}>
                Monitorowanie rozpoczęte 👁
            </Text>
            <Text style={{
                fontSize: 24,
                marginTop: 25,
                paddingHorizontal: 5,
                textAlign: "center"
            }}>
                Od teraz będziesz otrzymywał/-a powiadomienia 🔔,
                które będą Ci przypominać o zażyciu leków/suplementów 💊
                lub kończących się zapasach
            </Text>
            <Text style={{
                color: "#525252",
                fontSize: 22,
                marginTop: 10,
                paddingHorizontal: 5,
                textAlign: "center"
            }}>
                W godzinie zażycia medykamentu pojawi się przycisk,
                dzięki któremu potwierdzisz, że właśnie został
                przez Ciebie przyjęty ✅
            </Text>
            <TouchableOpacity
                testID="logoutButton"
                onPress={() => handleLogout()}
                style={{
                    backgroundColor: "#f38c4c",
                    borderRadius: 24,
                    height: 50,
                    justifyContent: "center",
                    marginTop: 20,
                    marginHorizontal: 15
                }}
            >
                <Text style={{
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: "300",
                    textAlign: "center"
                }}>
                    {loading ? 'Proszę czekać...' : 'Wyloguj się'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default Home;