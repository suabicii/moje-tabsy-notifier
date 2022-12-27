import React from "react";
import {Title} from "react-native-paper";
import {View} from "react-native";
import DosingMoments from "./DosingMoments";

function Drugs({drugList}) {
    return (
        <>
            {
                drugList.map(({dosing, name, unit, dosingMoments}, index) =>
                    (
                        <View key={`${name}${index}`}>
                            <Title style={{textAlign: "center"}}>{name} {dosing} {unit} w godz.</Title>
                            <DosingMoments
                                drugName={name}
                                content={Object.entries(dosingMoments)}
                            />
                        </View>
                    )
                )
            }
        </>
    );
}

export default Drugs;