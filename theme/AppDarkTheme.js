import {DefaultTheme} from "@react-navigation/native";

const AppDarkTheme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        ...DefaultTheme.colors,
        accordion: 'rgba(134,134,134,0.3)',
        background: '#1C1E1F',
        card: '#212529',
        text: '#ECEEEF'
    }
}

export default AppDarkTheme;