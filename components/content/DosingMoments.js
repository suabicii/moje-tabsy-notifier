import React, {useContext, useState} from "react";
import {DrugTakenContext} from "../../context/DrugTakenContext";
import dayjs from "dayjs";
import DosingMoment from "./DosingMoment";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function DosingMoments({drugName, content}) {
    const {drugTakenChecker, setDrugTakenChecker} = useContext(DrugTakenContext);
    const [dosingMomentsToShow, setDosingMomentsToShow] = useState(content);

    const result = [];

    for (const [key, value] of dosingMomentsToShow) {
        const viewKey = `${drugName}_${key}`;
        if (drugTakenChecker.find(string => string === viewKey)) {
            continue;
        }
        result.push(<DosingMoment key={viewKey} drugName={drugName} hour={value}/>);
    }

    return result;
}

export default DosingMoments;