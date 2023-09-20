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
    const borderStyles = {
        borderColor: '#dadada',
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1.75,
    };
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
                    ...borderStyles,
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
                    <List.Section style={{...borderStyles}}>
                        <List.Accordion
                            title="Wszystkie godziny zażywania"
                            style={{backgroundColor: 'rgba(227,226,226,0.3)'}}
                            expanded={expanded}
                            theme={{ colors: { primary: '#000' }}}
                            onPress={handlePress}>
                            {Object.values(dosingMoments).map((hour, index) => (
                                <List.Item title={hour} titleStyle={{textAlign: "center"}} key={index}/>
                            ))}
                        </List.Accordion>
                    </List.Section>
                </View>
            }
        </>
    );
}

export default Drug;