import React, {useState} from "react";
import dayjs from "dayjs";
import DosingMoment from "./DosingMoment";
import {useSelector} from "react-redux";

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function DosingMoments({drug, content}) {
    const drugsTaken = useSelector(state => state.drugsTaken);
    const time = useSelector(state => state.time);
    const [dosingMomentsToShow, setDosingMomentsToShow] = useState(content);

    const result = [];

    const handleSetDosingMomentsToShow = name => {
        setDosingMomentsToShow(
            dosingMomentsToShow.filter(dosingMoment => dosingMoment[0] !== name)
        );
    };

    for (const [key, value] of dosingMomentsToShow) {
        const viewKey = `${drug.name}_${key}`;

        if (drugsTaken.find(string => string === viewKey)) {
            continue;
        }

        const [hour, minutes] = value.split(':');
        const dosingDateTime = dayjs().hour(hour).minute(minutes);
        const currentTimeParsed = dayjs(JSON.parse(time.now));
        const confirmationBtnDisabled = !currentTimeParsed.isSameOrAfter(dosingDateTime);

        result.push(
            <DosingMoment
                key={viewKey}
                name={key}
                drugId={drug.id}
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