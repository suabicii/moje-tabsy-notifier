import {createSlice} from "@reduxjs/toolkit";

const notificationsQueueSlice = createSlice({
    name: 'notificationsQueue',
    initialState: [],
    reducers: {
        addNotificationId: (state, {payload: id}) => state.push(id),
        removeNotificationId: (state, {payload: idToRemove}) => state.filter(id => id !== idToRemove),
        setNotificationsQueue: (state, action) => action.payload
    }
});

const {reducer, actions} = notificationsQueueSlice;

export const {addNotificationId, removeNotificationId, setNotificationsQueue} = actions;

export default reducer;