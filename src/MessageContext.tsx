import React, {
    FC, 
    createContext, 
    useContext, 
    useState,
    useCallback,
    useMemo
} from 'react'
import { 
    Snackbar, 
    Portal, 
    Dialog, 
    Button, 
    Text
} from 'react-native-paper'
import { bootstrapMainColors, supercolor, Color} from 'jebcolors'

// Types START
interface BaseOptions {
    color?: string,
    label?: string
}

interface SnackOptions extends BaseOptions {
    large?: boolean,
}

interface DialogOptons extends BaseOptions {
    static?: boolean,
}

type MessageOptions = SnackOptions | DialogOptons

type Callback = () => void

interface AskOptions extends Omit<DialogOptons,'label'> {
    label?: string[]
}

type ContextValue = {
    showSnack: (text: string, options?: SnackOptions) => void;
    showDialog: (text: string, options?: DialogOptons) => void;
    showMessage: (text: string, options: MessageOptions) => void;
    useSnackForMessages: () => void;
    useDialogForMessages: () => void;
    ask: (text:string, onYes:Callback, onNo?:Callback, options?:AskOptions) => void;
}
// Types END

// CONTEXT USE AND PROVIDER //
const messageContextDefaultValue:ContextValue = {
    showSnack: (text:string, options?:SnackOptions) => {text; options},
    showDialog: (text:string, options?:DialogOptons) => {text; options},
    showMessage: (text:string, options?:MessageOptions) => {text; options},
    useSnackForMessages: () => {null},
    useDialogForMessages: () => {null},
    ask: (text:string, onYes:Callback, onNo?:Callback, options?:AskOptions) => {text;onYes;onNo;options},
}

const MessageContext = createContext(messageContextDefaultValue)

export const useMessage = ():ContextValue => useContext(MessageContext)

export const MessageProvider:FC = ({children}) => {
    // General Start //
    // SFM means "Snack For Message" and stores if you want to use the snack when using showMessage (default is false so the dialog is used)
    const [useSFM, setUseSFM] = useState(false)

    const getSupercolor = useCallback((color?:string):Color|undefined => {
        if(!color) return undefined
        switch(color){
            case 'success': return supercolor(bootstrapMainColors.success)
            case 'error': return supercolor(bootstrapMainColors.danger)
            case 'warning': return supercolor(bootstrapMainColors.warning)
            case 'info': return supercolor(bootstrapMainColors.info)
            case 'default': return undefined
            default: return supercolor(color)
        }
    },[])
    // General End //

    // Snack Message Start //
    const SNACK_LARGE = useMemo(() => 7000, [])
    const SNACK_SHORT = useMemo(() => 2500, [])

    const [snackVisible, setSnackVisible] = useState(false)
    const [snackText, setSnackText] = useState('Default Message')
    const [snackDuration, setSnackDuration] = useState(SNACK_SHORT)
    const [snackBackgroundColor, setSnackBackgroundColor] = useState<string|undefined>()
    const [snackButtonColor, setSnackButtonColor] = useState<string|undefined>()
    const [snackButtonText, setSnackButtonText] = useState('OK')

    const openSnack = useCallback(() => setSnackVisible(true),[])
    const closeSnack = useCallback(() => setSnackVisible(false),[])
    const showSnack = useCallback((text:string, options?:SnackOptions) => {
        text = text ?? 'Default Message'

        const large = options?.large ? true : false
        const color = getSupercolor(options?.color ?? 'default')
        const label = options?.label ?? 'OK'

        setSnackText(text.toString())
        setSnackDuration(large ? SNACK_LARGE : SNACK_SHORT)
        setSnackBackgroundColor(color?.code)
        setSnackButtonColor(color?.text)
        setSnackButtonText(label)
        openSnack()
    },[SNACK_LARGE, SNACK_SHORT, getSupercolor, openSnack])
    // Snack Message End //

    // Dialog Message Start //
    const [dialogVisible, setDialogVisible] = useState(false)
    const [dialogText, setDialogText] = useState('Default Message')
    const [dialogStatic, setDialogStatic] = useState(false)
    const [dialogBackgroundColor, setDialogBackgroundColor] = useState<string|undefined>()
    const [dialogButtonColor, setDialogButtonColor] = useState<string|undefined>()
    const [dialogButtonText, setDialogButtonText] = useState('OK')

    const openDialog = useCallback(() => setDialogVisible(true),[])
    const closeDialog = useCallback(() => setDialogVisible(false),[])
    const showDialog = useCallback((text:string, options?:DialogOptons) => {
        text = text ?? 'Message'

        const _static = options?.static ? true : false
        const color = getSupercolor(options?.color ?? 'default')
        const label = options?.label ?? 'OK'

        setDialogText(text.toString())
        setDialogStatic(_static)
        setDialogBackgroundColor(color?.code)
        setDialogButtonColor(color?.text)
        setDialogButtonText(label)
        openDialog()
    },[getSupercolor, openDialog])
    // Dialog Message End //

    // Show Message Start //
    const showMessage = useCallback((text:string, options:MessageOptions) => {
        if(useSFM){
            showSnack(text, options)
        }
        else{
            showDialog(text, options)
        }
    },[showDialog, showSnack, useSFM])

    const useSnackForMessages = useCallback(() => setUseSFM(true),[])
    const useDialogForMessages = useCallback(() => setUseSFM(false),[])
    // Show Message End //

    // Dialog Ask Start //
    const [askVisible, setAskVisible] = useState(false)
    const [askText, setAskText] = useState('Default Message')
    const [askStatic, setAskStatic] = useState(false)
    const [askBackgroundColor, setAskBackgroundColor] = useState<string|undefined>()
    const [askButtonColor, setAskButtonColor] = useState<string|undefined>()
    const [askButtonsText, setAskButtonsText] = useState(['NO','YES'])
    const [askYesFunction, setAskYesFunction] = useState<Callback|undefined>()
    const [askNoFunction, setAskNoFunction] = useState<Callback|undefined>()

    const openAsk = useCallback(() => setAskVisible(true),[])
    const closeAsk = useCallback(() => setAskVisible(false),[])
    const ask = useCallback((text:string, onYes:Callback, onNo?:Callback, options?:AskOptions) => {
        text = text ?? 'Message'
        
        if(typeof onYes === 'function'){
            setAskYesFunction(() => () => {onYes(); closeAsk()})
        }
        else{
            setAskYesFunction(() => closeAsk)
        }

        if(typeof onNo === 'function'){
            setAskNoFunction(() => () => {onNo(); closeAsk()})
        }
        else{
            setAskNoFunction(() => closeAsk)
        }

        const _static = options?.static ? true : false
        const color = getSupercolor(options?.color ?? 'default')
        const label = options?.label ?? ['NO','YES']
        
        setAskText(text.toString())
        setAskStatic(_static)
        setAskBackgroundColor(color?.code)
        setAskButtonColor(color?.text)
        setAskButtonsText(label)
        
        openAsk()
    },[closeAsk, getSupercolor, openAsk])
    // Dialog Ask End //

    // Provider Start
    const value = useMemo(() => ({
        showSnack,
        showDialog,
        showMessage,
        useSnackForMessages,
        useDialogForMessages,
        ask,
    }),[ask, showDialog, showMessage, showSnack, useDialogForMessages, useSnackForMessages])
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

            <Portal>
                <Dialog 
                    visible={askVisible} 
                    onDismiss={closeAsk} 
                    dismissable={!askStatic} 
                    style={{backgroundColor: askBackgroundColor}}
                >
                    <Dialog.Title>
                        <Text style={{color: askButtonColor}}>
                            {askText}
                        </Text>
                    </Dialog.Title>
                    <Dialog.Actions>
                        <Button 
                            color={askButtonColor} 
                            onPress={askNoFunction}
                        >
                            {askButtonsText[0]}
                        </Button>
                        <Button 
                            color={askButtonColor} 
                            onPress={askYesFunction}
                        >
                            {askButtonsText[1]}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </MessageContext.Provider>
    )
}

// CONTEXT AND USE PROVIDER END //