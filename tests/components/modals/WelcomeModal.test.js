import React from "react";
import renderer from "react-test-renderer";
import WelcomeModal from "../../../components/modals/WelcomeModal";

it('should correctly render WelcomeModal', () => {
    const tree = renderer.create(<WelcomeModal isVisible={true}/>).toJSON();

    expect(tree).toMatchSnapshot();
});