import { FC } from 'react';
interface BaseOptions {
    color?: string;
    label?: string;
}
interface SnackOptions extends BaseOptions {
    large?: boolean;
}
interface DialogOptons extends BaseOptions {
    static?: boolean;
}
declare type MessageOptions = SnackOptions | DialogOptons;
declare type Callback = () => void;
interface AskOptions extends Omit<DialogOptons, 'label'> {
    label?: string[];
}
declare type ContextValue = {
    showSnack: (text: string, options?: SnackOptions) => void;
    showDialog: (text: string, options?: DialogOptons) => void;
    showMessage: (text: string, options: MessageOptions) => void;
    useSnackForMessages: () => void;
    useDialogForMessages: () => void;
    ask: (text: string, onYes: Callback, onNo?: Callback, options?: AskOptions) => void;
};
export declare const useMessage: () => ContextValue;
export declare const MessageProvider: FC;
export {};
