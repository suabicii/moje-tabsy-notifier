import {createSlice} from "@reduxjs/toolkit";
import {ajaxCall} from "../../utils/ajaxCall";
import {setActiveSession} from "../activeSession/activeSessionSlice";

const drugsSlice = createSlice({
    name: 'drugs',
    initialState: [],
    reducers: {
        setDrugs: (state, action) => action.payload
    }
});

const {actions, reducer} = drugsSlice;

export const {setDrugs} = actions;

export const fetchDrugs = token => async dispatch => {
    await ajaxCall('get', `drug-notify/${token}`)
        .then(data => {
            if (!data?.error) {
                dispatch(setDrugs(data));
            } else {
                dispatch(setActiveSession(false));
                console.error(data);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

export default reducer;