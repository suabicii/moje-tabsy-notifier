import React from "react";
import {Text, View} from "react-native";

function TextError({content}) {
    return (
        <View>
            <Text style={{
                color: "#ff5252",
                fontSize: 20,
                fontWeight: "200",
                marginBottom: 20,
                textAlign: "center"
            }}>
                {content}
            </Text>
        </View>
    );
}

export default TextError;