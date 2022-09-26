import React from "react";
import {TextInput, View} from "react-native";
import {Text} from "react-native";

function UserInput({name, value, setValue, keyboardType = "default", secureTextEntry = false}) {
    return (
        <View style={{marginHorizontal: 24}}>
            <Text style={{
                color: "#414959",
                fontWeight: "300"
            }}>
                {name}
            </Text>
            <TextInput
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={{
                    borderBottomWidth: 0.5,
                    height: 48,
                    borderBottomColor: '#8e93a1',
                    marginBottom: 30
                }}
                value={value}
                onChangeText={text => setValue(text)}
            />
        </View>
    );
}

export default UserInput;