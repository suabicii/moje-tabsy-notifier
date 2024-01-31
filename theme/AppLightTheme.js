import {DefaultTheme} from "@react-navigation/native";

const AppLightTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        text: '#414959',
        background: '#fff'
    }
}

export default AppLightTheme;