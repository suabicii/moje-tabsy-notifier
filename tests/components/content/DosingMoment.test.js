import React from "react";
import renderer from "react-test-renderer";
import {DrugTakenContext} from "../../../context/DrugTakenContext";
import DosingMoment from "../../../components/content/DosingMoment";
import {drugList} from "../../fixtures/drugList";

const drugTakenChecker = [];
const setDrugTakenChecker = jest.fn();
const mockUseContext = jest.fn().mockImplementation(() => ({drugTakenChecker, setDrugTakenChecker}));

React.useContext = mockUseContext;

function WrappedComponent() {
    const drug = drugList[0];

    return (
        <DrugTakenContext.Provider value={{drugTakenChecker, setDrugTakenChecker}}>
            <DosingMoment
                drugName={drug.name}
                hour={`${Object.values(drug.dosingMoments)[0]}`}
                id={`${drug.name}_${Object.keys(drug.dosingMoments)[0]}`}
            />
        </DrugTakenContext.Provider>
    );
}

it('should correctly render single DosingMoment component', () => {
    const tree = renderer.create(<WrappedComponent/>).toJSON();
    expect(tree).toMatchSnapshot();
});