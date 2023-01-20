import React, {useContext, useState} from "react";
import {useDrugTakenContext} from "../../context/DrugTakenContext";
import dayjs from "dayjs";
import DosingMoment from "./DosingMoment";
import {TimeContext} from "../../context/TimeContext";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function DosingMoments({drugName, content}) {
    const {drugTakenChecker} = useDrugTakenContext();
    const {currentTime} = useContext(TimeContext);
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

        const [hour, minutes] = value.split(':');
        const dosingDateTime = dayjs().hour(hour).minute(minutes);
        const confirmationBtnDisabled = !currentTime.isSameOrAfter(dosingDateTime);

        result.push(
            <DosingMoment
                key={viewKey}
                name={key}
                drugName={drugName}
                time={value}
                id={viewKey}
                disabled={confirmationBtnDisabled}
                handleSetDosingMomentsToShow={handleSetDosingMomentsToShow}
            />
        );
    }

    return result;
}

export default DosingMoments;