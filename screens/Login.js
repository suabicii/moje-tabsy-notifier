import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Text} from "react-native";
import UserInput from "../components/auth/UserInput";
import PillButton from "../components/buttons/PillButton";
import TextError from "../components/error/TextError";
import {registerIndieID} from "native-notify";
import {APP_ID, APP_TOKEN} from "@env";
import {generateToken} from "../utils/tokenGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../utils/ajaxCall";

function Login({navigation}) {
    const registerIndieIDAndMoveToHomeScreen = async (data, token) => {
        await registerIndieID(data.user_id, APP_ID, APP_TOKEN);
        navigation.navigate('Home', {
            logged: true,
            userId: data.user_id,
            token
        });
    };

// Check if user is already saved in back-end -> if yes, login automatically
    const autoLogin = async () => {
        const token = await AsyncStorage.getItem('moje_tabsy_token');
        if (token) {
            await ajaxCall('post', 'login-auto', {body: {token}})
                .then(async data => {
                    if (data.status === 200 && data.message) {
                        console.log(data.message);
                        await AsyncStorage.clear();
                    } else if (data.status === 200 && data.user_id) {
                        await registerIndieIDAndMoveToHomeScreen(data, token);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    useEffect(() => {
        autoLogin().then(() => {
        });
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        const token = generateToken();
        await AsyncStorage.setItem('moje_tabsy_token', token);
        await ajaxCall('post', 'login', {email, password, token})
            .then(async data => {
                if (data.error || data.status !== 200) {
                    setLoginError(data.error);
                } else {
                    await registerIndieIDAndMoveToHomeScreen(data, token);
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
            <UserInput testID="email" name="EMAIL" value={email} setValue={setEmail}/>
            <UserInput testID="password" name="HASŁO" value={password} setValue={setPassword} secureTextEntry={true}/>
            {loginError && <TextError content={loginError}/>}
            <PillButton loading={loading} handlePress={handleSubmit} variant="primary" text="Zaloguj się"/>
        </View>
    );
}

export default Login;