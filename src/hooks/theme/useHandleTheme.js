import {Context} from "../../store";
import {useContext} from 'react';

export default function useHandleTheme() {
    const [{theme}, ACTION] = useContext(Context);

    const LS_TITLE = 'theme';
    const DATA_TYPE_TITLE = 'data-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';

    const switchTheme = () => {
        const newTheme = theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;

        localStorage.setItem(LS_TITLE, newTheme);
        ACTION.SET_THEME(newTheme);
        document.querySelector('body').setAttribute(DATA_TYPE_TITLE, newTheme);
    }

    const setDefaultTheme = () => {
        const newTheme = localStorage.getItem(LS_TITLE) || THEME_DARK;

        localStorage.setItem(LS_TITLE, newTheme);
        ACTION.SET_THEME(newTheme);
        document.querySelector('body').setAttribute(DATA_TYPE_TITLE, newTheme);
    }

    return {
        setDefaultTheme, switchTheme,
    }
}