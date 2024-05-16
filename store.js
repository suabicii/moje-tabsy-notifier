import {configureStore} from "@reduxjs/toolkit";
import drugsSlice from "./features/drugs/drugsSlice";
import timeSlice from "./features/time/timeSlice";
import drugsTakenSlice from "./features/drugsTaken/drugsTakenSlice";
import expandedAccordionsSlice from "./features/detailsExpanded/expandedAccordionsSlice";
import activeSessionSlice from "./features/activeSession/activeSessionSlice";

export default configureStore({
    reducer: {
        activeSession: activeSessionSlice,
        drugs: drugsSlice,
        drugsTaken: drugsTakenSlice,
        expandedAccordions: expandedAccordionsSlice,
        time: timeSlice
    }
});