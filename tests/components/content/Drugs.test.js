import React from "react";
import renderer from "react-test-renderer";
import Drugs from "../../../components/content/Drugs";
import {drugList} from "../../fixtures/drugList";
import {DrugTakenContext} from "../../../context/DrugTakenContext";

const drugTakenChecker = [];
const setDrugTakenChecker = jest.fn();
const mockUseContext = jest.fn().mockImplementation(() => ({drugTakenChecker, setDrugTakenChecker}));

React.useContext = mockUseContext;

function WrappedComponent() {
    return (
        <DrugTakenContext.Provider value={{drugTakenChecker, setDrugTakenChecker}}>
            <Drugs drugList={drugList}/>
        </DrugTakenContext.Provider>
    );
}

it('should correctly render drug data', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});