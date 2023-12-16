import {createSlice} from "@reduxjs/toolkit";

const expandedAccordionsSlice = createSlice({
    name: 'expandedAccordions',
    initialState: [],
    reducers: {
        setExpandedAccordions: (state, action) => action.payload,
        addExpandedAccordion: (state, action) => {
            const {id} = action.payload;
            state.push({id});
        },
        removeExpandedAccordion: (state, action) => {
            const id = action.payload;
            return state.filter(accordion => accordion.id !== id);
        }
    }
});

const {actions, reducer} = expandedAccordionsSlice;

export const {setExpandedAccordions, addExpandedAccordion, removeExpandedAccordion} = actions;

export default reducer;