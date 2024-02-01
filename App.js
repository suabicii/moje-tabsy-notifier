import Login from "./screens/Login";
import Home from "./screens/Home";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Provider} from "react-redux";
import store from "./store";
import React, {useEffect, useState} from "react";
import {Button} from "react-native-paper";
import {useColorScheme} from "react-native";
import AppLightTheme from "./theme/AppLightTheme";
import AppDarkTheme from "./theme/AppDarkTheme";

const Stack = createNativeStackNavigator();

export default function App() {
    const colorScheme = useColorScheme();
    const lightModeIcon = 'white-balance-sunny';
    const darkModeIcon = 'weather-night';
    const themeDefault = colorScheme === "light" ? AppLightTheme : AppDarkTheme;
    const themeTogglerIconDefault = colorScheme === "light" ? lightModeIcon : darkModeIcon;
    const [theme, setTheme] = useState(themeDefault);
    const [themeTogglerIcon, setThemeTogglerIcon] = useState(themeTogglerIconDefault);

    const appTitle = 'MediMinder 💊';
    const headerBarStyles = {
        headerStyle: {
            backgroundColor: "#78c2ad"
        },
        headerTintColor: '#fff'
    };

    function ThemeToggler() {
        return <Button
            mode="text"
            color="#fff"
            compact={true}
            icon={themeTogglerIcon}
            style={{marginTop: 3}}
            contentStyle={{
                padding: 0,
                height: 25,
            }}
            labelStyle={{fontSize: 25}}
            onPress={toggleTheme}
        />
    }

    const toggleTheme = () => {
        if (themeTogglerIcon === lightModeIcon) {
            setTheme(AppDarkTheme);
            setThemeTogglerIcon(darkModeIcon);
        } else {
            setTheme(AppLightTheme);
            setThemeTogglerIcon(lightModeIcon);
        }
    };

    useEffect(() => {
        if (colorScheme === 'dark') {
            setTheme(AppDarkTheme);
        }
    }, []);

    return (
        <NavigationContainer theme={theme}>
            <Provider store={store}>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{
                            title: `${appTitle} | Zaloguj się`,
                            headerRight: () => <ThemeToggler/>,
                            ...headerBarStyles
                        }}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                        options={{
                            title: `${appTitle} | Powiadomienia`,
                            headerRight: () => <ThemeToggler/>,
                            headerBackVisible: false,
                            ...headerBarStyles
                        }}
                    />
                </Stack.Navigator>
            </Provider>
        </NavigationContainer>
    );
}