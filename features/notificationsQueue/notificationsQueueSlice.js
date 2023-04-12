import {createSlice} from "@reduxjs/toolkit";

const notificationsQueueSlice = createSlice({
    name: 'notificationsQueue',
    initialState: [],
    reducers: {
        addNotification: (state, action) => {
            const {id, name, drugName, dosing, unit, hour} = action.payload;
            state.push({id, name, drugName, dosing, unit, hour});
        },
        removeNotification: (state, action) => {
            const id = action.payload;
            return state.filter(notification => notification.id !== id);
        },
        setNotificationsQueue: (state, action) => action.payload
    }
});

const {reducer, actions} = notificationsQueueSlice;

export const {addNotification, removeNotification, setNotificationsQueue} = actions;

export default reducer;