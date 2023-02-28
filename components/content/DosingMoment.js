import React, {useState} from "react";
import {Button, Paragraph} from "react-native-paper";
import {View} from "react-native";
import {useDrugTakenContext} from "../../context/DrugTakenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../../utils/ajaxCall";

function DosingMoment({name, drugId, time, id, disabled, handleSetDosingMomentsToShow}) {
    const {drugTakenChecker, setDrugTakenChecker} = useDrugTakenContext();
    const [btnLoading, setBtnLoading] = useState(false);

    const handleConfirmDose = async () => {
        setBtnLoading(true);
        const token = await AsyncStorage.getItem('moje_tabsy_token');
        await ajaxCall('put', `drug-taken/${token}/${drugId}`)
            .then(async response => {
                if (response.status === 200) {
                    const drugTakenCheckerNewValue = [...drugTakenChecker, id];
                    setDrugTakenChecker(drugTakenCheckerNewValue);
                    await AsyncStorage.setItem('drugTakenChecker', JSON.stringify(drugTakenCheckerNewValue));
                    handleSetDosingMomentsToShow(name);
                } else {
                    console.log(response);
                }
            })
            .catch(err => {
                console.log(err);
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
                }}
            >
                Już zażyłem/-am
            </Button>
        </View>
    );
}

export default DosingMoment;