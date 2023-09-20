import React from "react";
import {View} from "react-native";
import {Button, Title} from "react-native-paper";
import DosingMoments from "./DosingMoments";
import {useSelector} from "react-redux";

function Drug({drug}) {
    const drugsTaken = useSelector(state => state.drugsTaken);

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
        <>
            {
                // do not render drug component (content) if all doses was already taken
                currentDrugsTaken.length !== dosingMomentsArray.length
                &&
                <View style={{
                    borderColor: '#dadada',
                    borderRadius: 4,
                    borderStyle: 'solid',
                    borderWidth: 1.75,
                    marginBottom: 10,
                    paddingHorizontal: 15,
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
                        style={{
                            backgroundColor: '#525252',
                            marginBottom: 10
                        }}
                        mode="contained"
                        icon="arrow-right"
                        contentStyle={{flexDirection: "row-reverse"}}
                        onPress={() => console.log('DetailsBtn pressed')}
                    >
                        Szczegóły
                    </Button>

                </View>
            }
        </>
    );
}

export default Drug;