import React, {useState} from "react";
import {View} from "react-native";
import {Text} from "react-native";
import UserInput from "../components/auth/UserInput";
import SubmitButton from "../components/auth/SubmitButton";
import {API_URL} from "@env";
import TextError from "../components/error/TextError";
import {registerIndieID} from "native-notify";
import {APP_ID, APP_TOKEN} from "@env";
import {generateToken} from "../utils/tokenGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Login({navigation}) {
    // Check if user is already saved in back-end -> if yes, login automatically
    (async () => {
        const token = await AsyncStorage.getItem('moje_tabsy_token');
        if (token) {
            await fetch(`${API_URL}/api/login-auto`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token})
            })
                .then(data => data.json())
                .then(async data => {
                    if (data.status === 200 && data.message) {
                        console.log(data.message);
                    } else if (data.status === 200 && data.user_id) {
                        await registerIndieID(data.user_id, APP_ID, APP_TOKEN);
                        navigation.navigate('Home', {
                            logged: true,
                            userId: data.user_id
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    })();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        const token = generateToken();
        await AsyncStorage.setItem('moje_tabsy_token', token);
        await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, token})
        })
            .then(data => data.json())
            .then(async data => {
                if (data.error || data.status !== 200) {
                    setLoginError(data.error);
                } else {
                    await registerIndieID(data.user_id, APP_ID, APP_TOKEN);
                    navigation.navigate('Home', {
                        logged: true,
                        userId: data.user_id
                    });
                }
            })
            .catch(err => {
                console.log(err.message);
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
            <SubmitButton loading={loading} handleSubmit={handleSubmit}/>
        </View>
    );
}

export default Login;