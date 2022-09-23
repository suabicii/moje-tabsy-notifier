import React, {useState} from "react";
import {View} from "react-native";
import Text from "@kaloraat/react-native-text";
import UserInput from "../components/auth/UserInput";
import SubmitButton from "../components/auth/SubmitButton";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        console.log('Button was pressed');
    }

    return (
        <View style={{flex: 1, justifyContent: "center"}}>
            <Text title center style={{marginBottom: 20}}>Zaloguj się, aby otrzymywać powiadomienia</Text>
            <UserInput name="EMAIL" value={email} setValue={setEmail}/>
            <UserInput name="HASŁO" value={password} setValue={setPassword} secureTextEntry={true}/>
            <SubmitButton loading={loading} handleSubmit={handleSubmit}/>
        </View>
    );
}

export default Login;