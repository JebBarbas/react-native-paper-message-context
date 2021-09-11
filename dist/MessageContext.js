import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Portal, Dialog, Button, Text } from 'react-native-paper';
import { bootstrapMainColors, supercolor } from 'jebcolors';
// Types END
// CONTEXT USE AND PROVIDER //
const messageContextDefaultValue = {
    showSnack: (text, options) => { text; options; },
    showDialog: (text, options) => { text; options; },
    showMessage: (text, options) => { text; options; },
    useSnackForMessages: () => { null; },
    useDialogForMessages: () => { null; },
    ask: (text, onYes, onNo, options) => { text; onYes; onNo; options; },
};
const MessageContext = createContext(messageContextDefaultValue);
export const useMessage = () => useContext(MessageContext);
export const MessageProvider = ({ children }) => {
    // General Start //
    // SFM means "Snack For Message" and stores if you want to use the snack when using showMessage (default is false so the dialog is used)
    const [useSFM, setUseSFM] = useState(false);
    const getSupercolor = (color) => {
        if (!color)
            return undefined;
        switch (color) {
            case 'success': return supercolor(bootstrapMainColors.success);
            case 'error': return supercolor(bootstrapMainColors.danger);
            case 'warning': return supercolor(bootstrapMainColors.warning);
            case 'info': return supercolor(bootstrapMainColors.info);
            case 'default': return undefined;
            default: return supercolor(color);
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
        const color = getSupercolor(options?.color ?? 'default');
        const label = options?.label ?? 'OK';
        setSnackText(text.toString());
        setSnackDuration(large ? SNACK_LARGE : SNACK_SHORT);
        setSnackBackgroundColor(color?.code);
        setSnackButtonColor(color?.text);
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
        const color = getSupercolor(options?.color ?? 'default');
        const label = options?.label ?? 'OK';
        setDialogText(text.toString());
        setDialogStatic(_static);
        setDialogBackgroundColor(color?.code);
        setDialogButtonColor(color?.text);
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
    // Dialog Ask Start //
    const [askVisible, setAskVisible] = useState(false);
    const [askText, setAskText] = useState('Default Message');
    const [askStatic, setAskStatic] = useState(false);
    const [askBackgroundColor, setAskBackgroundColor] = useState();
    const [askButtonColor, setAskButtonColor] = useState();
    const [askButtonsText, setAskButtonsText] = useState(['NO', 'YES']);
    const [askYesFunction, setAskYesFunction] = useState();
    const [askNoFunction, setAskNoFunction] = useState();
    const openAsk = () => setAskVisible(true);
    const closeAsk = () => setAskVisible(false);
    const ask = (text, onYes, onNo, options) => {
        text = text ?? 'Message';
        onYes = onYes ?? (() => { null; });
        onNo = onNo ?? closeAsk;
        const _static = options?.static ? true : false;
        const color = getSupercolor(options?.color ?? 'default');
        const label = options?.label ?? ['NO', 'YES'];
        setAskText(text.toString());
        setAskStatic(_static);
        setAskBackgroundColor(color?.code);
        setAskButtonColor(color?.text);
        setAskButtonsText(label);
        setAskYesFunction(onYes);
        setAskNoFunction(onNo);
        openAsk();
    };
    // Dialog Ask End //
    // Provider Start
    const value = {
        showSnack,
        showDialog,
        showMessage,
        useSnackForMessages,
        useDialogForMessages,
        ask,
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
                    React.createElement(Button, { color: dialogButtonColor, onPress: closeDialog }, dialogButtonText)))),
        React.createElement(Portal, null,
            React.createElement(Dialog, { visible: askVisible, onDismiss: askNoFunction, dismissable: !askStatic, style: { backgroundColor: askBackgroundColor } },
                React.createElement(Dialog.Title, null,
                    React.createElement(Text, { style: { color: askButtonColor } }, askText)),
                React.createElement(Dialog.Actions, null,
                    React.createElement(Button, { color: askButtonColor, onPress: askNoFunction }, askButtonsText[0]),
                    React.createElement(Button, { color: askButtonColor, onPress: askYesFunction }, askButtonsText[1]))))));
};
// CONTEXT AND USE PROVIDER END //
//# sourceMappingURL=MessageContext.js.map