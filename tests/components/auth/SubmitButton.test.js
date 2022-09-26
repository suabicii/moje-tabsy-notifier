import React from "react";
import renderer from "react-test-renderer";
import SubmitButton from "../../../components/auth/SubmitButton";

it('should correctly render SubmitButton', () => {
    const handleSubmit = jest.fn();
    const tree = renderer.create(<SubmitButton handleSubmit={handleSubmit}/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should change text value when loading is true', () => {
    const handleSubmit = jest.fn();
    const btnBeforeLoading = renderer.create(
        <SubmitButton handleSubmit={handleSubmit}/>
    ).toJSON();
    const btnAfterLoading = renderer.create(
        <SubmitButton handleSubmit={handleSubmit} loading={true}/>
    ).toJSON();
    expect(btnBeforeLoading.children[0].children)
        .not
        .toEqual(btnAfterLoading.children[0].children);

    //EXPLANATION:
    /*
       console.log(btnBeforeLoading.children);
    * [
        {
          type: 'Text',
          props: { style: [Object] },
          children: [ 'Zaloguj się' ]
        }
    ]
    * */
});