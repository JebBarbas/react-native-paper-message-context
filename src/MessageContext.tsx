import React, {
    FC, 
    createContext, 
    useContext, 
    useState
} from 'react'
import { 
    Snackbar, 
    Portal, 
    Dialog, 
    Button, 
    Text
} from 'react-native-paper'
import { bootstrapMainColors,  bootstrapUnusedColors, isDarkColor} from 'jebcolors'

// Types START
type SnackOptions = {
    large?: boolean,
    color?: string,
    label?: string
}

type DialogOptons = {
    static?: boolean,
    color?: string,
    label?: string
}

type MessageOptions = SnackOptions | DialogOptons

type ContextValue = {
    showSnack: (text: string, options?: SnackOptions) => void;
    showDialog: (text: string, options?: DialogOptons) => void;
    showMessage: (text: string, options: MessageOptions) => void;
    useSnackForMessages: () => void;
    useDialogForMessages: () => void;
}
// Types END

// CONTEXT USE AND PROVIDER //
const messageContextDefaultValue:ContextValue = {
    showSnack: (text:string, options?:SnackOptions) => {text; options},
    showDialog: (text:string, options?:DialogOptons) => {text; options},
    showMessage: (text:string, options?:MessageOptions) => {text; options},
    useSnackForMessages: () => {0},
    useDialogForMessages: () => {0},
}

const MessageContext = createContext(messageContextDefaultValue)

export const useMessage = ():ContextValue => useContext(MessageContext)

export const MessageProvider:FC = ({children}) => {
    // General Start //
    // SFM means "Snack For Message" and stores if you want to use the snack when using showMessage (default is false so the dialog is used)
    const [useSFM, setUseSFM] = useState(false)

    const getBackgroundColor = (color?:string) => {
        if(!color) return undefined
        switch(color){
            case 'success': return bootstrapMainColors.success
            case 'error': return bootstrapMainColors.danger
            case 'warning': return bootstrapMainColors.warning
            case 'info': return bootstrapMainColors.info
            case 'default': return undefined
            default: return color
        }
    }

    const getButtonColor = (color?:string) => {
        if(!color) return undefined
        const {white, black} = bootstrapUnusedColors
        switch(color){
            case 'success': return white
            case 'error': return white
            case 'warning': return black
            case 'info': return black
            case 'default': return undefined
            default: return isDarkColor(color) ? white : black
        }
    }
    // General End //

    // Snack Message Start //
    const SNACK_LARGE = 7000
    const SNACK_SHORT = 2500

    const [snackVisible, setSnackVisible] = useState(false)
    const [snackText, setSnackText] = useState('Default Message')
    const [snackDuration, setSnackDuration] = useState(SNACK_SHORT)
    const [snackBackgroundColor, setSnackBackgroundColor] = useState<string|undefined>()
    const [snackButtonColor, setSnackButtonColor] = useState<string|undefined>()
    const [snackButtonText, setSnackButtonText] = useState('OK')

    const openSnack = () => setSnackVisible(true)
    const closeSnack = () => setSnackVisible(false)
    const showSnack = (text:string, options?:SnackOptions) => {
        text = text ?? 'Default Message'

        const large = options?.large ? true : false
        const color = options?.color ?? 'default'
        const label = options?.label ?? 'OK'

        setSnackText(text.toString())
        setSnackDuration(large ? SNACK_LARGE : SNACK_SHORT)
        setSnackBackgroundColor(getBackgroundColor(color))
        setSnackButtonColor(getButtonColor(color))
        setSnackButtonText(label)
        openSnack()
    }
    // Snack Message End //

    // Dialog Message Start //
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogText, setDialogText] = useState('Default Message')
    const [dialogStatic, setDialogStatic] = useState(false)
    const [dialogBackgroundColor, setDialogBackgroundColor] = useState<string|undefined>()
    const [dialogButtonColor, setDialogButtonColor] = useState<string|undefined>()
    const [dialogButtonText, setDialogButtonText] = useState('OK')

    const openDialog = () => setDialogVisible(true)
    const closeDialog = () => setDialogVisible(false)
    const showDialog = (text:string, options?:DialogOptons) => {
        text = text ?? 'Message'

        const _static = options?.static ? true : false
        const color = options?.color ?? 'default'
        const label = options?.label ?? 'OK'

        setDialogText(text.toString())
        setDialogStatic(_static)
        setDialogBackgroundColor(getBackgroundColor(color))
        setDialogButtonColor(getButtonColor(color))
        setDialogButtonText(label)
        openDialog()
    }
    // Dialog Message End //

    // Show Message Start //
    const showMessage = (text:string, options:MessageOptions) => {
        if(useSFM){
            showSnack(text, options)
        }
        else{
            showDialog(text, options)
        }
    }

    const useSnackForMessages = () => setUseSFM(true)
    const useDialogForMessages = () => setUseSFM(false)
    // Show Message End //

    // Provider Start
    const value = {
        showSnack,
        showDialog,
        showMessage,
        useSnackForMessages,
        useDialogForMessages,
    }
    // Provider End

    return (
        <MessageContext.Provider value={value}>
            { children }

            <Snackbar
                visible={snackVisible}
                onDismiss={closeSnack}
                action={{
                    color: snackButtonColor,
                    label: snackButtonText,
                    onPress: closeSnack
                }}
                duration={snackDuration}
                style={{backgroundColor: snackBackgroundColor}}
            >
                <Text style={{color:snackButtonColor}}>{snackText}</Text>
            </Snackbar>

            <Portal>
                <Dialog 
                    visible={dialogVisible} 
                    onDismiss={closeDialog} 
                    dismissable={!dialogStatic} 
                    style={{backgroundColor: dialogBackgroundColor}}
                >
                    <Dialog.Title>
                        <Text style={{color: dialogButtonColor}}>
                            {dialogText}
                        </Text>
                    </Dialog.Title>
                    <Dialog.Actions>
                        <Button 
                            color={dialogButtonColor} 
                            onPress={closeDialog}
                        >
                            {dialogButtonText}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </MessageContext.Provider>
    )
}

// CONTEXT AND USE PROVIDER END //