import {DefaultTheme} from "@react-navigation/native";

const AppLightTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        accordion: 'rgba(227,226,226,0.3)',
        background: '#fff',
        card: '#fff',
        text: '#414959'
    }
}

export default AppLightTheme;