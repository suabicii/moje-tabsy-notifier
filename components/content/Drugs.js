import React from "react";
import {Button, Title} from "react-native-paper";
import {View} from "react-native";
import DosingMoments from "./DosingMoments";
import {useSelector} from "react-redux";

function Drugs() {
    const drugsTaken = useSelector(state => state.drugsTaken);
    const drugList = useSelector(state => state.drugs);

    return (
        <>
            {
                drugList.map((drug, index) => {
                    const {dosing, name, unit, dosingMoments} = drug;
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
                                <View style={{
                                    borderColor: '#dadada',
                                    borderRadius: 4,
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    marginBottom: 10,
                                    paddingHorizontal: 15
                                }}>
                                    <Title
                                        testID={name}
                                        style={{textAlign: "center"}}
                                    >
                                        {name} {dosing} {unit} w godz.
                                    </Title>
                                    <DosingMoments
                                        drug={drug}
                                        content={dosingMomentsArray}
                                    />
                                    <Button
                                        testId="detailsBtn"
                                        style={{marginBottom: 10}}
                                        mode="contained"
                                        icon="arrow-right"
                                        contentStyle={{flexDirection: "row-reverse"}}
                                        onPress={() => console.log('DetailsBtn pressed')}
                                    >
                                        Szczegóły
                                    </Button>
                                </View>
                            }
                        </View>
                    );
                })
            }
        </>
    );
}

export default Drugs;