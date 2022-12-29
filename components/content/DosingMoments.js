import React, {useContext, useState} from "react";
import {View} from "react-native";
import {Button, Paragraph} from "react-native-paper";
import {DrugTakenContext} from "../../context/DrugTakenContext";
import dayjs from "dayjs";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function DosingMoments({drugName, content}) {
    const {drugTakenChecker, setDrugTakenChecker} = useContext(DrugTakenContext);
    const [dosingMomentsToShow, setDosingMomentsToShow] = useState(content);

    const handleConfirmDose = drugName => {

    };

    const result = [];

    for (const [key, value] of dosingMomentsToShow) {
        // const [hour, minutes] = value.split(':');
        // const dosingDateTime = dayjs().hour(hour).minute(minutes);
        // console.log(dayjs().isSameOrAfter(dosingDateTime));

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
                    // disabled={true}
                    icon="check"
                    mode="contained"
                    compact={true}
                    onPress={() => {
                        handleConfirmDose(drugName);
                        setDosingMomentsToShow(
                            dosingMomentsToShow.filter(dosingMoment => dosingMoment[0] !== key)
                        );
                        setDrugTakenChecker([...drugTakenChecker, viewKey]);
                        // Todo: zapis do AsyncStorage
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