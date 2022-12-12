import React from "react";
import {Button, Paragraph, Title} from "react-native-paper";
import {View} from "react-native";

function Drugs({drugList}) {
    const dummyFn = () => {
    };

    return (
        <>
            {
                drugList.map(({dosing, name, unit, dosingMoments}, index) => {
                    const DosingMoments = () => {
                        const result = [];
                        for (const key in dosingMoments) {
                            if (dosingMoments.hasOwnProperty(key)) {
                                result.push(
                                    <View
                                        style={{
                                            alignItems: "center",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            marginBottom: 10
                                        }}
                                        key={`${name}${key}`}
                                    >
                                        <Paragraph style={{textAlign: "center", fontSize: 16}}>
                                            - {dosingMoments[key]}
                                        </Paragraph>
                                        <Button
                                            style={{
                                                backgroundColor: "#6cc3d5",
                                                color: "#e8e8e8",
                                                marginLeft: 5
                                            }}
                                            contentStyle={{flexDirection: "row-reverse"}}
                                            icon="check"
                                            mode="contained"
                                            compact={true}
                                            onPress={() => dummyFn}
                                        >
                                            Już zażyłem/-am
                                        </Button>
                                    </View>
                                );
                            }
                        }
                        return result;
                    };

                    return (
                        <View key={`${name}${index}`}>
                            <Title style={{textAlign: "center"}}>{name} {dosing} {unit} w godz.</Title>
                            <DosingMoments/>
                        </View>
                    );
                })
            }
        </>
    );
}

export default Drugs;