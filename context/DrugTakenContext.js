import React, {createContext, useContext} from "react";

const DrugTakenContext = createContext([]);

export const useDrugTakenContext = () => useContext(DrugTakenContext);

export default DrugTakenContext;