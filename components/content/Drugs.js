import React from "react";
import {Paragraph, Title} from "react-native-paper";
import {View} from "react-native";
import PillButton from "../buttons/PillButton";

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
                                    <Paragraph style={{textAlign: "center"}} key={`${name}${key}`}>
                                        - {dosingMoments[key]}
                                    </Paragraph>
                                );
                            }
                        }
                        return result;
                    };

                    return (
                        <View key={`${name}${index}`}>
                            <Title style={{textAlign: "center"}}>{name} {dosing} {unit} w godz.</Title>
                            <DosingMoments/>
                            <PillButton
                                handlePress={dummyFn}
                                loading={false}
                                text={'Już zażyłem/-am 👍'}
                                variant={'info'}
                            />
                        </View>
                    );
                })
            }
        </>
    );
}

export default Drugs;