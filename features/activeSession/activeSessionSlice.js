import { createSlice } from "@reduxjs/toolkit"

const activeSessionSlice = createSlice({
    name: 'activeSession',
    initialState: false,
    reducers: {
        setActiveSession: (state, action) => action.payload
    }
});

const {actions, reducer} = activeSessionSlice;

export const {setActiveSession} = actions;

export default reducer;