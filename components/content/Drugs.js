import React, {useState} from "react";
import {Button, Paragraph, Title} from "react-native-paper";
import {View} from "react-native";

function Drugs({drugList}) {

    const handleConfirmDose = () => {

    };

    return (
        <>
            {
                drugList.map(({dosing, name, unit, dosingMoments}, index) => {
                    const DosingMoments = () => {
                        const [dosingMomentsToShow, setDosingMomentsToShow] = useState(Object.entries(dosingMoments));
                        const result = [];
                        for (const [key, value] of dosingMomentsToShow) {
                            const viewKey = `${name}${key}`;
                            result.push(
                                <View
                                    style={{
                                        alignItems: "center",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        marginBottom: 10
                                    }}
                                    key={viewKey}
                                >
                                    <Paragraph style={{textAlign: "center", fontSize: 16}}>
                                        – {`${value}`}
                                    </Paragraph>
                                    <Button
                                        testID={viewKey}
                                        style={{
                                            backgroundColor: "#6cc3d5",
                                            color: "#e8e8e8",
                                            marginLeft: 5
                                        }}
                                        contentStyle={{flexDirection: "row-reverse"}}
                                        icon="check"
                                        mode="contained"
                                        compact={true}
                                        onPress={() => {
                                            handleConfirmDose(viewKey);
                                            setDosingMomentsToShow(
                                                dosingMomentsToShow.filter(dosingMoment => dosingMoment[0] !== key)
                                            );
                                        }}
                                    >
                                        Już zażyłem/-am
                                    </Button>
                                </View>
                            );
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