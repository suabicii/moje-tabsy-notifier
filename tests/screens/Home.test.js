import React from "react";
import renderer from "react-test-renderer";
import Home from "../../screens/Home";

it('should correctly render Home screen', () => {
    const tree = renderer.create(<Home/>).toJSON();
    expect(tree).toMatchSnapshot();
});