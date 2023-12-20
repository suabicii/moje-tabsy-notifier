import {configureStore} from "@reduxjs/toolkit";
import drugsSlice from "./features/drugs/drugsSlice";
import timeSlice from "./features/time/timeSlice";
import drugsTakenSlice from "./features/drugsTaken/drugsTakenSlice";
import expandedAccordionsSlice from "./features/detailsExpanded/expandedAccordionsSlice";

export default configureStore({
    reducer: {
        drugs: drugsSlice,
        drugsTaken: drugsTakenSlice,
        expandedAccordions: expandedAccordionsSlice,
        time: timeSlice
    }
});