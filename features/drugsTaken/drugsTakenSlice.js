import {createSlice} from "@reduxjs/toolkit";

// State = array for storing strings associated
// with dosing moment keys -> if user clicks confirmation button, key will be pushed to the array, so thanks to it
// dosing moment won't be rendered again later

const drugsTakenSlice = createSlice({
    name: 'drugsTaken',
    initialState: [],
    reducers: {
        setDrugsTaken: (state, action) => action.payload
    }
});

const {actions, reducer} = drugsTakenSlice;

export const {setDrugsTaken} = actions;

export default reducer;