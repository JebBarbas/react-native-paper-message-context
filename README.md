# react-native-paper-message-context
Uses react-native-paper to show messages (in form of dialog or snack) in an easy n fast form. (includes predefined styles and configuration)

## Dependencies
This module needs to have instaled
- react
- react-native
- react-native-paper

## Instalation
Just run in your console
`npm i react-native-paper-message-context`

## Usage - Principal
To use first import the `MessageProvider` inside your `PaperProvider`. If you want to handle dinamic DarkTheme
I recommend you to install `react-native-paper-navigation-theme-context`.

```jsx
import React from 'react'
import {Provider as PaperProvider} from 'react-native-paper'
import {MessageProvider} from 'react-native-paper-message-context'

// This is suposed to be your app
import Screen from './Screen'

const App = () => {
    return (
        <PaperProvider>
            <MessageProvider>
                <Screen/>
            </MessageProvider>
        </PaperProvider>
    )
}

export default App
```

Once made this, use the hook `useMessage()` to show a message.

```jsx
// ...
import {useMessage} from 'react-native-paper-message-context'

const CustomComponent = () => {
    const {showMessage} = useMessage()
    return (
        <Button onPress={()=>showMessage('Hello World')}>Show Message</Button>
    )
}

export default CustomComponent
```

## Usage - Change the message options
You can customize a little your messages with the optional parameter `options`:
- large: The snack for default has a short duration, with `large` in true, it will have a larger duration (snack) 
(default is `false`).
- static: When using dialog, if you click outside, it will be dissmissed, but if `static` is true, this will not 
happen (dialog) (default is `false`).
- color: The background color of the dialog or the snack, can recieve a color in format #RGB or #RRGGBB or some 
of the next predefined colors: 'success', 'error', 'warning' or 'info' (snack and dialog) (default is `null`, uses
the PaperProvider primary color).
- label: The text of the button of the snack of dialog (snack and dialog) (default is `'OK'`).

## Usage - Snack or Dialog?
Maybe you're confused because I said that the options are for a Snack or Dialog, let me explain. For default
`showMessage()` shows a Dialog, but you can change this using `useSnackForMessages` and `useDialogForMessages`.

```jsx
// ...
import {MessageProvider, useMessage} from 'react-native-paper-message-context'

const WithSnack = ({children}) => {
    const {useSnackForMessages} = useMessage()
    
    useSnackForMessages()

    return (
        <>
            {children}
        </>
    )
}

// Now any showMessage() call inside <WithSnack> will be a Snack instead of a Dialog

const App = () => {
    return (
        <PaperProvider>
            <MessageProvider>
                <WithSnack>
                    <Screen>
                </WithSnack>
            </MessageProvider>
        </PaperProvider>
    )
}
```

Another option if you don't want to make all of this, `useMessage()` provides also two functions to show 
specificaly a Dialog or a Snack: `showSnack()` and `showDialog()`.

```jsx
// ...

const CustomComponent = () => {
    const {showSnack, showDialog} = useMessage()

    return (
        <View>
            <Button onPress={()=>showSnack('Nice',{color:'success'})}>
                Show a Snack saying something went fine
            </Button>
            <Button onPress={()=>showDialog('Error',{color:'danger'})}>
                Show a Dialog saying something went very wrong
            </Button>
        </View>
    )
}

export default CustomComponent
```