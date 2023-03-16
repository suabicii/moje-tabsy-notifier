import React from "react";
import {Title} from "react-native-paper";
import {View} from "react-native";
import DosingMoments from "./DosingMoments";
import {useSelector} from "react-redux";

function Drugs({drugList}) {
    const drugsTaken = useSelector(state => state.drugsTaken);

    return (
        <>
            {
                drugList.map(({id, dosing, name, unit, dosingMoments}, index) => {
                    const dosingMomentsArray = Object.entries(dosingMoments);
                    let currentDrugsTaken = [];

                    for (const [key] of dosingMomentsArray) {
                        currentDrugsTaken = [
                            ...currentDrugsTaken,
                            ...drugsTaken.filter(string => string === `${name}_${key}`)
                        ];
                    }

                    return (
                        <View key={`${name}${index}`}>
                            {
                                // do not render drug component (content) if all doses was already taken
                                currentDrugsTaken.length !== dosingMomentsArray.length
                                &&
                                <>
                                    <Title
                                        testID={name}
                                        style={{textAlign: "center"}}>
                                        {name} {dosing} {unit} w godz.
                                    </Title>
                                    <DosingMoments
                                        drugId={id}
                                        drugName={name}
                                        content={dosingMomentsArray}
                                    />
                                </>
                            }
                        </View>
                    );
                })
            }
        </>
    );
}

export default Drugs;