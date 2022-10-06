/**
 * @jest-environment jsdom
 * */
import React from "react";
import renderer from "react-test-renderer";
import Login from "../../screens/Login";
import {fireEvent, render, screen} from "@testing-library/react-native";
import {act} from "@testing-library/react-native";

beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({status: 200})
    }));
});

afterAll(() => {
    jest.clearAllMocks();
    delete global.fetch;
});

it('should correctly render Login screen', () => {
    const tree = renderer.create(<Login/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('should navigate to notifications screen if logging in succeeded', async () => {
    render(<Login/>);

    await act(async () => {
        fireEvent.changeText(screen.getByTestId('email'), 'dummy@email.com');
        fireEvent.changeText(screen.getByTestId('password'), 'dummyPassword123^&!');
        fireEvent.press(screen.getByTestId('submit'));
    });
});