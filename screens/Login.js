import React, {useState} from "react";
import {View} from "react-native";
import {Text} from "react-native";
import UserInput from "../components/auth/UserInput";
import SubmitButton from "../components/auth/SubmitButton";
import {API_URL} from "@env";
import TextError from "../components/error/TextError";

function Login({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
            .then(data => data.json())
            .then(data => {
                if (data.error || data.status !== 200) {
                    setLoginError(data.error);
                    setTimeout(() => {
                        setLoginError('');
                    }, 5000);
                } else {
                    navigation.navigate('Home', {logged: true});
                }
            })
            .catch(err => {
                console.log(err);
                setLoginError(err.toString());
            });
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