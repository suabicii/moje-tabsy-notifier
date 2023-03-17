import {configureStore} from "@reduxjs/toolkit";
import drugsSlice from "./features/drugs/drugsSlice";
import timeSlice from "./features/time/timeSlice";
import drugsTakenSlice from "./features/drugsTaken/drugsTakenSlice";
import notificationsQueueSlice from "./features/notificationsQueue/notificationsQueueSlice";

export default configureStore({
    reducer: {
        drugs: drugsSlice,
        drugsTaken: drugsTakenSlice,
        time: timeSlice,
        notificationsQueue: notificationsQueueSlice
    }
});