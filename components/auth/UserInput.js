import React from "react";
import {TextInput, View} from "react-native";
import {Text} from "react-native";
import {useTheme} from "@react-navigation/native";

function UserInput({name, value, setValue, keyboardType = "default", secureTextEntry = false, testID}) {
    const {colors} = useTheme();

    return (
        <View style={{marginHorizontal: 24}}>
            <Text style={{
                color: colors.text,
                fontWeight: "300"
            }}>
                {name}
            </Text>
            <TextInput
                testID={testID}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={{
                    color: colors.text,
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