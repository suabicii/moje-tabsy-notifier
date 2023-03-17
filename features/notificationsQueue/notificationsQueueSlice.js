import {createSlice} from "@reduxjs/toolkit";

const notificationsQueueSlice = createSlice({
    name: 'notificationsQueue',
    initialState: [],
    reducers: {
        addNotificationId: (state, {payload: id}) => state.push(id)
    }
});

const {reducer, actions} = notificationsQueueSlice;

export const {addNotificationId} = actions;

export default reducer;