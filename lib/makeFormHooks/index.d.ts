import makeMakeFormStore from "../makeFormStore";
import { InputValueFromOptions } from "../makeFormStore/types";
declare type AllFormStoresObject = Record<string, {
    hook: ReturnType<ReturnType<typeof makeMakeFormStore>>[0];
    api: ReturnType<ReturnType<typeof makeMakeFormStore>>[1];
}>;
export declare function makeFormHooks<T_AllFormStores extends AllFormStoresObject>(allFormStores: T_AllFormStores): {
    useFormInput: <T_FormName extends keyof T_AllFormStores, T_InputId extends { [P_FormName in keyof T_AllFormStores]: keyof ReturnType<T_AllFormStores[P_FormName]["api"]["getState"]>["inputStates"]; }[T_FormName]>({ formName, inputId }: {
        inputId: T_InputId;
        formName: T_FormName;
    }) => {
        value: any;
        onChange: (newValue: InputValueFromOptions<any, any, any, any, any>) => any;
        onFocus: () => any;
        onBlur: () => any;
        isFocused: any;
        isEdited: any;
        isValid: any;
        canShowErrors: boolean;
        hasVisibleErrors: boolean;
        inlineErrorTexts: any[];
        latestVisibleInlineErrorTexts: any[];
        localErrorTypes: any;
        localErrorTextByErrorType: any;
        serverErrorTexts: any;
        shouldShowPlaceholder: boolean;
        validatorsOptions: any;
        valueIsEmpty: boolean;
    };
};
export {};
