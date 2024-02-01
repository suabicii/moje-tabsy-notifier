import React, {useState} from "react";
import {Button, Paragraph} from "react-native-paper";
import {View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ajaxCall} from "../../utils/ajaxCall";
import {useDispatch, useSelector} from "react-redux";
import {setDrugsTaken} from "../../features/drugsTaken/drugsTakenSlice";
import {useTheme} from "@react-navigation/native";

function DosingMoment({name, drugId, time, id, disabled, handleSetDosingMomentsToShow}) {
    const drugsTaken = useSelector(state => state.drugsTaken);
    const dispatch = useDispatch();
    const {colors} = useTheme();
    const [btnLoading, setBtnLoading] = useState(false);

    const handleConfirmDose = async () => {
        setBtnLoading(true);
        const token = await AsyncStorage.getItem('moje_tabsy_token');
        await ajaxCall('put', `drug-taken/${token}/${drugId}`)
            .then(async response => {
                if (response.status === 200) {
                    const drugsTakenNewValue = [...drugsTaken, id];
                    dispatch(setDrugsTaken(drugsTakenNewValue));
                    await AsyncStorage.setItem('drugs_taken', JSON.stringify(drugsTakenNewValue));
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
            <Paragraph style={{
                color: colors.text,
                textAlign: "center",
                fontSize: 16
            }}>
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