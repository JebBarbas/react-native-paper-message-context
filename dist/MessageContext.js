import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Portal, Dialog, Button, Text } from 'react-native-paper';
import { bootstrapMainColors, bootstrapUnusedColors, isDarkColor } from 'jebcolors';
// Types END
// CONTEXT USE AND PROVIDER //
const messageContextDefaultValue = {
    showSnack: (text, options) => { text; options; },
    showDialog: (text, options) => { text; options; },
    showMessage: (text, options) => { text; options; },
    useSnackForMessages: () => { 0; },
    useDialogForMessages: () => { 0; },
};
const MessageContext = createContext(messageContextDefaultValue);
export const useMessage = () => useContext(MessageContext);
export const MessageProvider = ({ children }) => {
    // General Start //
    // SFM means "Snack For Message" and stores if you want to use the snack when using showMessage (default is false so the dialog is used)
    const [useSFM, setUseSFM] = useState(false);
    const getBackgroundColor = (color) => {
        if (!color)
            return undefined;
        switch (color) {
            case 'success': return bootstrapMainColors.success;
            case 'error': return bootstrapMainColors.danger;
            case 'warning': return bootstrapMainColors.warning;
            case 'info': return bootstrapMainColors.info;
            case 'default': return undefined;
            default: return color;
        }
    };
    const getButtonColor = (color) => {
        if (!color)
            return undefined;
        const { white, black } = bootstrapUnusedColors;
        switch (color) {
            case 'success': return white;
            case 'error': return white;
            case 'warning': return black;
            case 'info': return black;
            case 'default': return undefined;
            default: return isDarkColor(color) ? white : black;
        }
    };
    // General End //
    // Snack Message Start //
    const SNACK_LARGE = 7000;
    const SNACK_SHORT = 2500;
    const [snackVisible, setSnackVisible] = useState(false);
    const [snackText, setSnackText] = useState('Default Message');
    const [snackDuration, setSnackDuration] = useState(SNACK_SHORT);
    const [snackBackgroundColor, setSnackBackgroundColor] = useState();
    const [snackButtonColor, setSnackButtonColor] = useState();
    const [snackButtonText, setSnackButtonText] = useState('OK');
    const openSnack = () => setSnackVisible(true);
    const closeSnack = () => setSnackVisible(false);
    const showSnack = (text, options) => {
        text = text ?? 'Default Message';
        const large = options?.large ? true : false;
        const color = options?.color ?? 'default';
        const label = options?.label ?? 'OK';
        setSnackText(text.toString());
        setSnackDuration(large ? SNACK_LARGE : SNACK_SHORT);
        setSnackBackgroundColor(getBackgroundColor(color));
        setSnackButtonColor(getButtonColor(color));
        setSnackButtonText(label);
        openSnack();
    };
    // Snack Message End //
    // Dialog Message Start //
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogText, setDialogText] = useState('Default Message');
    const [dialogStatic, setDialogStatic] = useState(false);
    const [dialogBackgroundColor, setDialogBackgroundColor] = useState();
    const [dialogButtonColor, setDialogButtonColor] = useState();
    const [dialogButtonText, setDialogButtonText] = useState('OK');
    const openDialog = () => setDialogVisible(true);
    const closeDialog = () => setDialogVisible(false);
    const showDialog = (text, options) => {
        text = text ?? 'Message';
        const _static = options?.static ? true : false;
        const color = options?.color ?? 'default';
        const label = options?.label ?? 'OK';
        setDialogText(text.toString());
        setDialogStatic(_static);
        setDialogBackgroundColor(getBackgroundColor(color));
        setDialogButtonColor(getButtonColor(color));
        setDialogButtonText(label);
        openDialog();
    };
    // Dialog Message End //
    // Show Message Start //
    const showMessage = (text, options) => {
        if (useSFM) {
            showSnack(text, options);
        }
        else {
            showDialog(text, options);
        }
    };
    const useSnackForMessages = () => setUseSFM(true);
    const useDialogForMessages = () => setUseSFM(false);
    // Show Message End //
    // Provider Start
    const value = {
        showSnack,
        showDialog,
        showMessage,
        useSnackForMessages,
        useDialogForMessages,
    };
    // Provider End
    return (React.createElement(MessageContext.Provider, { value: value },
        children,
        React.createElement(Snackbar, { visible: snackVisible, onDismiss: closeSnack, action: {
                color: snackButtonColor,
                label: snackButtonText,
                onPress: closeSnack
            }, duration: snackDuration, style: { backgroundColor: snackBackgroundColor } },
            React.createElement(Text, { style: { color: snackButtonColor } }, snackText)),
        React.createElement(Portal, null,
            React.createElement(Dialog, { visible: dialogVisible, onDismiss: closeDialog, dismissable: !dialogStatic, style: { backgroundColor: dialogBackgroundColor } },
                React.createElement(Dialog.Title, null,
                    React.createElement(Text, { style: { color: dialogButtonColor } }, dialogText)),
                React.createElement(Dialog.Actions, null,
                    React.createElement(Button, { color: dialogButtonColor, onPress: closeDialog }, dialogButtonText))))));
};
// CONTEXT AND USE PROVIDER END //
//# sourceMappingURL=MessageContext.js.map