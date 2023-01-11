import React, {useState} from "react";
import {useDrugTakenContext} from "../../context/DrugTakenContext";
import dayjs from "dayjs";
import DosingMoment from "./DosingMoment";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function DosingMoments({drugName, content}) {
    const {drugTakenChecker} = useDrugTakenContext();
    const [dosingMomentsToShow, setDosingMomentsToShow] = useState(content);

    const result = [];

    const handleSetDosingMomentsToShow = name => {
        setDosingMomentsToShow(
            dosingMomentsToShow.filter(dosingMoment => dosingMoment[0] !== name)
        );
    };

    for (const [key, value] of dosingMomentsToShow) {
        const viewKey = `${drugName}_${key}`;
        if (drugTakenChecker.find(string => string === viewKey)) {
            continue;
        }
        result.push(
            <DosingMoment
                key={viewKey}
                name={key}
                drugName={drugName}
                hour={value}
                id={viewKey}
                handleSetDosingMomentsToShow={handleSetDosingMomentsToShow}
            />
        );
    }

    return result;
}

export default DosingMoments;