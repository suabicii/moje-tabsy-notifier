import React from "react";
import renderer from "react-test-renderer";
import Drugs from "../../../components/content/Drugs";
import {drugList} from "../../fixtures/drugList";

it('should correctly render drug data', () => {
    const tree = renderer.create(<Drugs drugList={drugList}/>).toJSON();
    expect(tree).toMatchSnapshot();
});