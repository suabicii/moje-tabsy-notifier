import React, {useState} from "react";
import {View} from "react-native";
import {Title} from "react-native-paper";
import DosingMoments from "./DosingMoments";
import {useSelector} from "react-redux";
import {List} from 'react-native-paper';

function Drug({drug}) {
    const drugsTaken = useSelector(state => state.drugsTaken);
    const [expanded, setExpanded] = useState(false);

    const handlePress = () => setExpanded(!expanded);

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
                    paddingBottom: 10,
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
                    <List.Accordion
                        title="Wszystkie godziny zażywania"
                        expanded={expanded}
                        onPress={handlePress}>
                        {Object.values(dosingMoments).map((hour, index) => (
                            <List.Item title={hour} titleStyle={{textAlign: "center"}} key={index}/>
                        ))}
                    </List.Accordion>
                </View>
            }
        </>
    );
}

export default Drug;