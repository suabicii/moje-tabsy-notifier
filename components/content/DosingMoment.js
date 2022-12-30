import React, {useContext} from "react";
import {Button, Paragraph} from "react-native-paper";
import {View} from "react-native";
import {DrugTakenContext} from "../../context/DrugTakenContext";

function DosingMoment({drugName, hour, id}) {
    const {drugTakenChecker, setDrugTakenChecker} = useContext(DrugTakenContext);
    const handleConfirmDose = drugName => {

    };

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
                // disabled={true}
                icon="check"
                mode="contained"
                compact={true}
                onPress={() => {
                    handleConfirmDose(drugName);
                    // setDosingMomentsToShow(
                    //     dosingMomentsToShow.filter(dosingMoment => dosingMoment[0] !== key)
                    // );
                    setDrugTakenChecker([...drugTakenChecker, id]);
                    // Todo: zapis do AsyncStorage
                }}
            >
                Już zażyłem/-am
            </Button>
        </View>
    );
}

export default DosingMoment;