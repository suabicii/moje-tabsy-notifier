import {createSlice} from "@reduxjs/toolkit";

const timeSlice = createSlice({
    name: 'time',
    initialState: {},
    reducers: {
        setCurrentTime: (state, action) => ({...state, now: action.payload}),
        setTomorrowTime: (state, action) => ({...state, tomorrow: action.payload})
    }
});

const {actions, reducer} = timeSlice;

export const {setCurrentTime, setTomorrowTime} = actions;

export default reducer;