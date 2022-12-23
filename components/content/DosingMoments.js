import React, {useContext, useState} from "react";
import {View} from "react-native";
import {Button, Paragraph} from "react-native-paper";
import {DrugTakenContext} from "../../context/DrugTakenContext";

function DosingMoments({drugName, content, handleConfirmDose}) {
    const {drugTakenChecker, setDrugTakenChecker} = useContext(DrugTakenContext);
    const [dosingMomentsToShow, setDosingMomentsToShow] = useState(content);

    const result = [];

    for (const [key, value] of dosingMomentsToShow) {
        const viewKey = `${drugName}_${key}`;
        if (drugTakenChecker.find(string => string === viewKey)) {
            continue;
        }
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
                        setDrugTakenChecker([...drugTakenChecker, viewKey]);
                    }}
                >
                    Już zażyłem/-am
                </Button>
            </View>
        );
    }

    return result;
}

export default DosingMoments;