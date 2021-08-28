import { FC } from 'react';
declare type SnackOptions = {
    large?: boolean;
    color?: string;
    label?: string;
};
declare type DialogOptons = {
    static?: boolean;
    color?: string;
    label?: string;
};
declare type MessageOptions = SnackOptions | DialogOptons;
declare type ContextValue = {
    showSnack: (text: string, options?: SnackOptions) => void;
    showDialog: (text: string, options?: DialogOptons) => void;
    showMessage: (text: string, options: MessageOptions) => void;
    useSnackForMessages: () => void;
    useDialogForMessages: () => void;
};
export declare const useMessage: () => ContextValue;
export declare const MessageProvider: FC;
export {};
