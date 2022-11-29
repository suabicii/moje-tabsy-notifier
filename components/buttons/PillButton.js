import React from "react";
import {TouchableOpacity} from "react-native";
import {Text} from "react-native";

function PillButton({handlePress, loading, variant, text}) {
    let backgroundColor;
    if (variant === 'primary') {
        backgroundColor = '#78c2ad';
    } else if (variant === 'warning') {
        backgroundColor = '#f38c4c';
    } else {
        backgroundColor = '#525252';
    }
    
    return (
        <TouchableOpacity
            testID="btn-pill"
            onPress={handlePress}
            style={{
                backgroundColor,
                borderRadius: 24,
                height: 50,
                justifyContent: "center",
                marginBottom: 20,
                marginHorizontal: 15
            }}
        >
            <Text style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "300",
                textAlign: "center"
            }}>
                {loading ? 'Proszę czekać...' : text}
            </Text>
        </TouchableOpacity>
    );
}

export default PillButton;