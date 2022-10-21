
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

const submitUserData = async () => {
    await act(async () => {
        fireEvent.changeText(screen.getByTestId('email'), 'dummy@email.com');
        fireEvent.changeText(screen.getByTestId('password'), 'dummyPassword123^&!');
        fireEvent.press(screen.getByTestId('submit'));
    });
};

it('should navigate to Home screen if logging in succeeded', async () => {
    const navigate = jest.fn();
    render(<Login navigation={{navigate}}/>);

    await submitUserData();

    expect(navigate).toHaveBeenCalledWith('Home', {logged: true});
});

it('should display error message if logging in failed due authentication error', async () => {
    const navigate = jest.fn();
    render(<Login navigation={{navigate}}/>);
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve({error: 'Something went wrong'})
    }));

    await submitUserData();

    expect(screen.getByTestId('error')).toBeTruthy();
});

it('should display error message if logging in failed due connection problem', async () => {
    const navigate = jest.fn();
    render(<Login navigation={{navigate}}/>);
    fetch.mockRejectedValueOnce(new Error('Server error'));

    await submitUserData();

    expect(screen.getByTestId('error')).toBeTruthy();
});