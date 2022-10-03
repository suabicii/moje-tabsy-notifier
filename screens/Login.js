import React, {useState} from "react";
import {View} from "react-native";
import {Text} from "react-native";
import UserInput from "../components/auth/UserInput";
import SubmitButton from "../components/auth/SubmitButton";
import {API_URL} from "@env";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
                    console.log('Not Logged In', data);
                } else {
                    console.log('Logged In', data);
                }
            })
            .catch(err => {
                console.log(err);
            });
        setLoading(false);
    }

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
            <UserInput name="EMAIL" value={email} setValue={setEmail}/>
            <UserInput name="HASŁO" value={password} setValue={setPassword} secureTextEntry={true}/>
            <SubmitButton loading={loading} handleSubmit={handleSubmit}/>
        </View>
    );
}

export default Login;