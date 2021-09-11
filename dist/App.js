import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { MessageProvider, useMessage } from '.';
const Screen = () => {
    const { ask, showMessage } = useMessage();
    const hackNASA = () => {
        showMessage('NASA Hacked', { color: 'success' });
    };
    const askToLog = () => {
        ask('Are you sure you wanna hack the NASA?', hackNASA, undefined, {
            color: 'warning',
            label: ['NEVER', 'YES PLEASE']
        });
    };
    return (React.createElement(View, null,
        React.createElement(Button, { onPress: askToLog }, "start hack")));
};
const App = () => {
    return (React.createElement(MessageProvider, null,
        React.createElement(Screen, null)));
};
export default App;
//# sourceMappingURL=App.js.map