import React from "react";
import renderer from "react-test-renderer";
import TextError from "../../../components/error/TextError";

it('should correctly render TextError component with some content', () => {
    const tree = renderer.create(<TextError content="Dummy error"/>).toJSON();
    expect(tree).toMatchSnapshot();
});