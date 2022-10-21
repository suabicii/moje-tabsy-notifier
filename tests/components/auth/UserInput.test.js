import React from "react";
import renderer from "react-test-renderer";
import UserInput from "../../../components/auth/UserInput";

it('should correctly render UserInput component', () => {
    const setValue = jest.fn();
    const tree = renderer.create(
        <UserInput name="some_name" value="some_value" setValue={setValue}/>
    ).toJSON();
    expect(tree).toMatchSnapshot();
});