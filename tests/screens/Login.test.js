import React from "react";
import renderer from "react-test-renderer";
import Login from "../../screens/Login";

it('should correctly render Login screen', () => {
    const tree = renderer.create(<Login/>).toJSON();
    expect(tree).toMatchSnapshot();
});