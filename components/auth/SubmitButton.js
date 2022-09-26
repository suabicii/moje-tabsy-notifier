import React from "react";
import {TouchableOpacity} from "react-native";
import {Text} from "react-native";

function SubmitButton({handleSubmit, loading}) {
    return (
        <TouchableOpacity
            onPress={handleSubmit}
            style={{
                backgroundColor: "#78c2ad",
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
                {loading ? 'Proszę czekać...' : 'Zaloguj się'}
            </Text>
        </TouchableOpacity>
    );
}

export default SubmitButton;