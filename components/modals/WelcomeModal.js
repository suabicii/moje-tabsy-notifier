import React, {useState} from "react";
import {Modal, Pressable, Text, View, StyleSheet} from "react-native";

function WelcomeModal({isVisible = false}) {
    const [modalVisible, setModalVisible] = useState(isVisible);

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>
                            Od teraz będziesz otrzymywał/-a powiadomienia 🔔,
                            które będą Ci przypominać o zażyciu leków/suplementów 💊
                            lub kończących się zapasach
                        </Text>
                        <Text style={[styles.modalText, styles.modalTextSecondary]}>
                            W godzinie zażycia medykamentu pojawi się przycisk,
                            dzięki któremu potwierdzisz, że właśnie został
                            przez Ciebie przyjęty ✅
                        </Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 25,
        padding: 15,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        fontSize: 22,
        marginBottom: 15,
        textAlign: "center"
    },
    modalTextSecondary: {
        color: "#525252",
        fontSize: 20
    }
});

export default WelcomeModal;