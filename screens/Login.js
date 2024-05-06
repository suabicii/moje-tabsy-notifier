import React, {useEffect, useState} from "react";
import {Alert, ScrollView, View} from "react-native";
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
import {useTheme} from "@react-navigation/native";
import {BarCodeScanner} from "expo-barcode-scanner";
import CameraView from "../components/views/CameraView";
import {UrlUtils} from "../utils/UrlUtils";
import * as Device from "expo-device";
import IpLocation from "../utils/IpLocation";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    })
});

function Login({navigation}) {
    const dispatch = useDispatch();
    const {colors} = useTheme();
    const [hasPermission, setHasPermission] = useState(null);
    const [isCameraViewOpen, setIsCameraViewOpen] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const deviceInfo = {
        name: Device.deviceName || `${Device.brand} ${Device.modelName}`,
        system: `${Device.osName} ${Device.osVersion}`
    };

    const clearLoginError = () => {
        if (!loginError) {
            setTimeout(() => {
                setLoginError('');
            }, 5000);
        }
    };

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
                    Alert.alert(`${err}`);
                });
            setLoading(false);
        }
    };

    const loginByQrCode = async url => {
        const userData = UrlUtils.extractUserDataFromQrLoginUrl(url);
        if (userData) {
            await AsyncStorage.setItem('mediminder_token', userData.token);
            setLoading(true);
            const location = await IpLocation.getIpLocation();
            await ajaxCall('post', `login-qr?userId=${userData.userId}&token=${userData.token}`, {body: deviceInfo, ...location})
                .then(async data => {
                    if (data.status === 200 && data.user_id === userData.userId) {
                        await registerForNotificationsAndMoveToHomeScreen(data, userData.token);
                    } else {
                        setLoginError('Logowanie przez kod QR nie powiodło się');
                    }
                })
                .catch(err => {
                    setLoginError(`${err}`);
                });
            clearLoginError();
            setLoading(false);
        } else {
            Alert.alert('Nieprawidłowy URL');
        }
    };

    const handleBarcodeScanned = async ({type, data}) => {
        setScanned(true);
        setIsCameraViewOpen(false);
        setScanned(false);
        if (type === 256) {
            await loginByQrCode(data);
        } else {
            Alert.alert('To nie jest prawidłowy kod QR!');
        }
    };

    useEffect(() => {
        (async () => await autoLogin())();
        (async () => {
            let {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const token = generateToken();
        await AsyncStorage.setItem('mediminder_token', token);
        const location = await IpLocation.getIpLocation();
        await ajaxCall('post', 'login', {body: {email, password, token, ...deviceInfo, ...location}})
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
        clearLoginError();
        setLoading(false);
    };

    return (
        <ScrollView>
            <View style={{
                backgroundColor: colors.background,
                marginTop: 15
            }}>
                <Text style={{
                    color: colors.text,
                    fontWeight: "400",
                    fontSize: 32,
                    marginBottom: 15,
                    textAlign: "center"
                }}>
                    Zaloguj się, aby otrzymywać powiadomienia
                </Text>
                {
                    isCameraViewOpen &&
                    <CameraView
                        handleBarcodeScanned={handleBarcodeScanned}
                        hasPermission={hasPermission}
                        scanned={scanned}
                    />
                }
                <PillButton
                    id="camera"
                    handlePress={() => {
                        setIsCameraViewOpen(prevState => !prevState);
                        setScanned(false);
                    }}
                    variant="info"
                    text="Zaloguj się kodem QR"
                />
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
        </ScrollView>
    );
}

export default Login;