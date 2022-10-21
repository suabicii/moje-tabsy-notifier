/**
 * @jest-environment jsdom
 * */
import React from "react";
import renderer from "react-test-renderer";
import Home from "../../screens/Home";
import {render, screen, fireEvent} from "@testing-library/react-native";
import {BackHandler} from "react-native";

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

it('should go back to Login screen after pressing logout button', () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    render(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener
            }}
        />
    );

    fireEvent.press(screen.getByTestId('logoutButton'));

    expect(navigate).toBeCalled();
});

it('should block going back if user is logged in', () => {
    const addListener = jest.fn();
    const navigate = jest.fn();
    const dispatch = jest.fn();
    render(
        <Home
            route={{
                params: {logged: true}
            }}
            navigation={{
                navigate,
                addListener,
                dispatch
            }}
        />
    );

    BackHandler.mockPressBack();

    expect(navigate).toBeCalledTimes(0);
});