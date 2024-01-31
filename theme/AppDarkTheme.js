import {DefaultTheme} from "@react-navigation/native";

const AppDarkTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        text: '#ECEEEF',
        background: '#1C1E1F'
    }
}

export default AppDarkTheme;