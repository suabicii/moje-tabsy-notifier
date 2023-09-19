import React from "react";
import {useSelector} from "react-redux";
import Drug from "./Drug";
import {View} from "react-native";

function Drugs() {
    const drugList = useSelector(state => state.drugs);

    return (
        <>
            {drugList.map((drug, index) => (
                <View key={`drug-${index}`}>
                    <Drug drug={drug} index={index}/>
                </View>
            ))}
        </>
    );
}

export default Drugs;