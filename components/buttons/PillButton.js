import React from "react";
import {TouchableOpacity} from "react-native";
import {Text} from "react-native";

function PillButton({handlePress, loading, variant, text}) {
    let backgroundColor;

    switch (variant) {
        case 'primary':
            backgroundColor = '#78c2ad';
            break;
        case 'info':
            backgroundColor = '#6cc3d5';
            break;
        case 'warning':
            backgroundColor = '#f38c4c';
            break;
        default:
            backgroundColor = '#525252';
            break;
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