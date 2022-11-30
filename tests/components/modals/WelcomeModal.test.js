/**
 * @jest-environment jsdom
 * */
import React from "react";
import renderer from "react-test-renderer";
import WelcomeModal from "../../../components/modals/WelcomeModal";
import {render, act, fireEvent, screen} from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

it('should correctly render WelcomeModal', () => {
    const tree = renderer.create(<WelcomeModal isVisible={true}/>).toJSON();

    expect(tree).toMatchSnapshot();
});

it('should save information about welcome message disability in AsyncStorage if checkbox is checked', async () => {
    render(<WelcomeModal isVisible={true}/>);

    await act(async () => {
        fireEvent.press(screen.getByTestId('welcomeMsgDisableCheckbox'));
    });
    const msgDisable = await AsyncStorage.getItem('welcome_msg_disable');

    expect(msgDisable).toBeTruthy();
});

it('should remove information about welcome message disability from AsyncStorage if checkbox is unchecked', async () => {
    render(<WelcomeModal isVisible={true}/>);

    await act(async () => {
        fireEvent.press(screen.getByTestId('welcomeMsgDisableCheckbox')); // check
    });
    await act(async () => {
        fireEvent.press(screen.getByTestId('welcomeMsgDisableCheckbox')); // uncheck
    });
    const msgDisable = await AsyncStorage.getItem('welcome_msg_disable');

    expect(msgDisable).toBeFalsy();
});