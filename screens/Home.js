import React from "react";
import {Text, TouchableOpacity, View} from "react-native";

function Home({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: "center"}}>
            <Text style={{
                fontSize: 32,
                fontWeight: "500",
                textAlign: "center"
            }}>
                Monitorowanie rozpoczęte 👁
            </Text>
            <Text style={{
                fontSize: 24,
                marginTop: 25,
                paddingHorizontal: 5,
                textAlign: "center"
            }}>
                Od teraz będziesz otrzymywał/-a powiadomienia 🔔,
                które będą Ci przypominać o zażyciu leków/suplementów 💊
                lub kończących się zapasach
            </Text>
            <Text style={{
                color: "#525252",
                fontSize: 22,
                marginTop: 10,
                paddingHorizontal: 5,
                textAlign: "center"
            }}>
                W godzinie zażycia medykamentu pojawi się przycisk,
                dzięki któremu potwierdzisz, że właśnie został
                przez Ciebie przyjęty ✅
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{
                    backgroundColor: "#f38c4c",
                    borderRadius: 24,
                    height: 50,
                    justifyContent: "center",
                    marginTop: 20,
                    marginHorizontal: 15
                }}
            >
                <Text style={{
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: "300",
                    textAlign: "center"
                }}>
                    Wyloguj się
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default Home;