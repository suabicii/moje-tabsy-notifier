import React, {useEffect, useState} from "react";
import {ScrollView, TouchableOpacity, View} from "react-native";
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

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        alert(`Zeskanowano kod typu ${type} z następującymi danymi: ${data}`);
    };

    function CameraView() {
        return (
            <>
                {
                    hasPermission === true
                        ?
                        <View
                            testID="camera-view"
                            style={{
                                aspectRatio: 4 / 3,
                                borderRadius: 10,
                                marginBottom: 20,
                                marginLeft: 25,
                            }}
                        >
                            <BarCodeScanner
                                style={{flex: 1}}
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            />
                        </View>
                        :
                        <></>
                }
            </>
        )
    }

    useEffect(() => {
        (async function () {
            await autoLogin();
        })();
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
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
        <ScrollView>
            <View style={{
                backgroundColor: colors.background,
                marginTop: 15
            }}>
                <Text style={{
                    color: colors.text,
                    fontWeight: "400",
                    fontSize: 32,
                    marginBottom: 20,
                    textAlign: "center"
                }}>
                    Zaloguj się, aby otrzymywać powiadomienia
                </Text>
                {isCameraViewOpen && <CameraView/>}
                <TouchableOpacity
                    testID="camera-view-toggler"
                    style={{
                        backgroundColor: '#6cc3d5',
                        borderRadius: 5,
                        marginBottom: 25,
                        marginHorizontal: 20,
                        marginTop: 5,
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}
                    onPress={() => setIsCameraViewOpen(prevState => !prevState)}
                >
                    <Text style={{
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: "300",
                        textAlign: "center"
                    }}>
                        Zaloguj się kodem QR
                    </Text>
                </TouchableOpacity>
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