import React from "react";
import renderer from "react-test-renderer";
import Home from "../../screens/Home";

it('should correctly render Home screen', () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    const tree = renderer.create(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});