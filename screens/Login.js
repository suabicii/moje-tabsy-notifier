import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Text} from "react-native";
import UserInput from "../components/auth/UserInput";
import PillButton from "../components/buttons/PillButton";
import TextError from "../components/error/TextError";
import {generateToken} from "../utils/tokenGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";
import {useDispatch} from "react-redux";
import dayjs from "dayjs";
import {setCurrentTime} from "../features/time/timeSlice";
import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from "../utils/pushNotificationsRegistration";
import {ActivityIndicator, Colors} from "react-native-paper";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    })
});

function Login({navigation}) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const registerForNotificationsAndMoveToHomeScreen = async (data, loginToken) => {
        const currentTimeJSON = JSON.stringify(dayjs());
        dispatch(setCurrentTime(currentTimeJSON));

        const expoPushToken = await registerForPushNotificationsAsync();

        navigation.navigate('Home', {
            logged: true,
            userId: data.user_id,
            loginToken,
            expoPushToken
        });
    };

// Check if user is already saved in back-end -> if yes, login automatically
    const autoLogin = async () => {
        const token = await AsyncStorage.getItem('mediminder_token');
        if (token) {
            setLoading(true);
            await ajaxCall('post', 'login-auto', {body: {token}})
                .then(async data => {
                    if (data.status === 200 && data.message) {
                        console.log(data.message);
                        await AsyncStorage.clear();
                    } else if (data.status === 200 && data.user_id) {
                        await registerForNotificationsAndMoveToHomeScreen(data, token);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
            setLoading(false);
        }
    };

    useEffect(() => {
        (async function () {
            await autoLogin();
        })();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const token = generateToken();
        await AsyncStorage.setItem('mediminder_token', token);
        await ajaxCall('post', 'login', {body: {email, password, token}})
            .then(async data => {
                if (data.error || data.status !== 200) {
                    setLoginError(data.error);
                } else {
                    await registerForNotificationsAndMoveToHomeScreen(data, token);
                }
            })
            .catch(err => {
                setLoginError(`${err}`);
            });
        if (!loginError) {
            setTimeout(() => {
                setLoginError('');
            }, 5000);
        }
        setLoading(false);
    };

    return (
        <View style={{flex: 1, justifyContent: "center"}}>
            <Text style={{
                color: "#414959",
                fontWeight: "400",
                fontSize: 32,
                marginBottom: 20,
                textAlign: "center"
            }}>
                Zaloguj się, aby otrzymywać powiadomienia
            </Text>
            {
                loading
                    ?
                    <ActivityIndicator
                        testID="auto-login-loader"
                        animating={true}
                        size="large"
                        style={{marginBottom: 20}}
                        color={Colors.lightBlueA100}
                    />
                    :
                    <>
                        <UserInput testID="email" name="EMAIL" value={email} setValue={setEmail}/>
                        <UserInput testID="password" name="HASŁO" value={password} setValue={setPassword}
                                   secureTextEntry={true}/>
                    </>
            }
            {loginError && <TextError content={loginError}/>}
            <PillButton loading={loading} handlePress={handleSubmit} variant="primary" text="Zaloguj się"/>
        </View>
    );
}

export default Login;