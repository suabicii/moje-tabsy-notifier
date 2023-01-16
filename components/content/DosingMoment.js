import React, {useEffect} from "react";
import {Button, Paragraph} from "react-native-paper";
import {View} from "react-native";
import {useDrugTakenContext} from "../../context/DrugTakenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function DosingMoment({name, drugName, hour, id, handleSetDosingMomentsToShow}) {
    const {drugTakenChecker, setDrugTakenChecker} = useDrugTakenContext();

    const handleConfirmDose = drugName => {

    };

    useEffect(() => {

        return () => {

        };
    }, []);

    // const [hour, minutes] = value.split(':');
    // const dosingDateTime = dayjs().hour(hour).minute(minutes);
    // console.log(dayjs().isSameOrAfter(dosingDateTime));

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
                – {`${hour}`}
            </Paragraph>
            <Button
                testID={id}
                style={{
                    backgroundColor: "#6cc3d5",
                    color: "#e8e8e8",
                    marginLeft: 5
                }}
                contentStyle={{flexDirection: "row-reverse"}}
                icon="check"
                mode="contained"
                compact={true}
                onPress={async () => {
                    handleConfirmDose(drugName);
                    setDrugTakenChecker([...drugTakenChecker, id]);
                    await AsyncStorage.setItem('drugTakenChecker', JSON.stringify(drugTakenChecker));
                    handleSetDosingMomentsToShow(name);
                }}
            >
                Już zażyłem/-am
            </Button>
        </View>
    );
}

export default DosingMoment;