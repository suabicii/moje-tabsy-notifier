import React from "react";
import renderer from "react-test-renderer";
import PillButton from "../../../components/buttons/PillButton";

it('should correctly render PillButton', () => {
    const handlePress = jest.fn();
    const tree = renderer.create(<PillButton handlePress={handlePress}/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should change text value when loading is true', () => {
    const handlePress = jest.fn();
    const btnBeforeLoading = renderer.create(
        <PillButton handlePress={handlePress}/>
    ).toJSON();
    const btnAfterLoading = renderer.create(
        <PillButton handlePress={handlePress} loading={true}/>
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