import React, {useState} from "react";
import {Button, Paragraph} from "react-native-paper";
import {View} from "react-native";
import {useDrugTakenContext} from "../../context/DrugTakenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function DosingMoment({name, drugName, time, id, disabled, handleSetDosingMomentsToShow}) {
    const {drugTakenChecker, setDrugTakenChecker} = useDrugTakenContext();
    const [btnLoading, setBtnLoading] = useState(false);

    const handleConfirmDose = async () => {
        setBtnLoading(true);
        await (new Promise(resolve => {
            setTimeout(() => { // Temporarily to silence warning in IDE about unused property –> to be deleted
                resolve(`${drugName} was taken`);
            }, 2000);
        })).then(data => {
            console.log(data);
        });
    };

    return (
        <View
            style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 10
            }}
        >
            <Paragraph style={{textAlign: "center", fontSize: 16}}>
                – {`${time}`}
            </Paragraph>
            <Button
                testID={id}
                style={{
                    backgroundColor: "#6cc3d5",
                    color: "#e8e8e8",
                    marginLeft: 5
                }}
                disabled={disabled}
                loading={btnLoading}
                contentStyle={{flexDirection: "row-reverse"}}
                icon="check"
                mode="contained"
                compact={true}
                onPress={async () => {
                    await handleConfirmDose();
                    const drugTakenCheckerNewValue = [...drugTakenChecker, id];
                    setDrugTakenChecker(drugTakenCheckerNewValue);
                    await AsyncStorage.setItem('drugTakenChecker', JSON.stringify(drugTakenCheckerNewValue));
                    handleSetDosingMomentsToShow(name);
                }}
            >
                Już zażyłem/-am
            </Button>
        </View>
    );
}

export default DosingMoment;