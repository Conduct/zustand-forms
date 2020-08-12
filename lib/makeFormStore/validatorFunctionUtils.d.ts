import { InputValue, ValidatorParams, ValidatorReturn, AnyKey, UntypedValueTypes } from "./types";
export declare function getTypedMakeValidator<T_ValidatorType extends AnyKey, T_ValueTypes extends UntypedValueTypes<T_ValidatorType>>(valueTypes: T_ValueTypes): <T_CustomOptions extends Record<any, any>>(validatorFunction: (options: {
    value: InputValue<T_ValueTypes, any, keyof T_ValueTypes>;
    inputId: any;
    inputState: {
        inputId: any;
        valueType: any;
        value: any;
        initialValue: any;
        validatorTypes: any[];
        validatorsOptions: Record<any, any>;
        localErrorTypes: any[];
        localErrorTextByErrorType: Record<string, string>;
        serverErrorTexts: string[];
        timeUpdated: number;
        timeBecameCheckable: number;
        timeBecameUncheckable: number;
        timeFocused: number;
        timeUnfocused: number;
        isValidLocal: boolean;
        isValidServer: boolean;
        isValid: boolean;
        isEdited: boolean;
        hasBeenUnfocused: boolean;
        isFocused: boolean;
        isCheckable: boolean;
    };
    formState: {
        updateInput: <K_InputIdParam extends string | number | symbol>(options: {
            inputId: K_InputIdParam;
            newValue: any;
        }) => void;
        toggleFocus: (options: {
            inputId: string | number | symbol;
            isFocused: boolean;
        }) => void;
        toggleIsCheckable: (options: {
            inputId: string | number | symbol;
            isCheckable: boolean;
        }) => void;
        refreshForm: (initialValuesByInputId?: Partial<{
            [x: string]: T_ValueTypes[any]["blankValue"];
            [x: number]: T_ValueTypes[any]["blankValue"];
        }> | undefined, isCheckableByInputId?: Partial<Record<string | number | symbol, boolean>> | undefined, serverErrorsByInputId?: Partial<Record<string | number | symbol, string[]>> | undefined) => void;
    } & {
        allInputIds: (string | number | symbol)[];
        localErrorInputIds: (string | number | symbol)[];
        serverErrorInputIds: (string | number | symbol)[];
        checkableInputIds: (string | number | symbol)[];
        focusedInputId: string | number | symbol;
        inputStates: {
            [x: string]: {
                inputId: string;
                valueType: any;
                value: any;
                initialValue: any;
                validatorTypes: any[];
                validatorsOptions: Record<any, any>;
                localErrorTypes: any[];
                localErrorTextByErrorType: Record<string, string>;
                serverErrorTexts: string[];
                timeUpdated: number;
                timeBecameCheckable: number;
                timeBecameUncheckable: number;
                timeFocused: number;
                timeUnfocused: number;
                isValidLocal: boolean;
                isValidServer: boolean;
                isValid: boolean;
                isEdited: boolean;
                hasBeenUnfocused: boolean;
                isFocused: boolean;
                isCheckable: boolean;
            };
            [x: number]: {
                inputId: number;
                valueType: any;
                value: any;
                initialValue: any;
                validatorTypes: any[];
                validatorsOptions: Record<any, any>;
                localErrorTypes: any[];
                localErrorTextByErrorType: Record<string, string>;
                serverErrorTexts: string[];
                timeUpdated: number;
                timeBecameCheckable: number;
                timeBecameUncheckable: number;
                timeFocused: number;
                timeUnfocused: number;
                isValidLocal: boolean;
                isValidServer: boolean;
                isValid: boolean;
                isEdited: boolean;
                hasBeenUnfocused: boolean;
                isFocused: boolean;
                isCheckable: boolean;
            };
        };
        formValues: {
            [x: string]: any;
            [x: number]: any;
        };
        timeUpdated: number;
        timeRefreshed: number;
        timeFocused: number;
        timeUnfocused: number;
        isFocused: boolean;
        isEdited: boolean;
        isValid: boolean;
        isValidLocal: boolean;
        isValidServer: boolean;
        hasBeenUnfocused: boolean;
        isCheckable: boolean;
    };
} & {
    validatorOptions: T_CustomOptions;
}) => ValidatorReturn) => (options: {
    value: InputValue<T_ValueTypes, any, keyof T_ValueTypes>;
    inputId: any;
    inputState: {
        inputId: any;
        valueType: any;
        value: any;
        initialValue: any;
        validatorTypes: any[];
        validatorsOptions: Record<any, any>;
        localErrorTypes: any[];
        localErrorTextByErrorType: Record<string, string>;
        serverErrorTexts: string[];
        timeUpdated: number;
        timeBecameCheckable: number;
        timeBecameUncheckable: number;
        timeFocused: number;
        timeUnfocused: number;
        isValidLocal: boolean;
        isValidServer: boolean;
        isValid: boolean;
        isEdited: boolean;
        hasBeenUnfocused: boolean;
        isFocused: boolean;
        isCheckable: boolean;
    };
    formState: {
        updateInput: <K_InputIdParam extends string | number | symbol>(options: {
            inputId: K_InputIdParam;
            newValue: any;
        }) => void;
        toggleFocus: (options: {
            inputId: string | number | symbol;
            isFocused: boolean;
        }) => void;
        toggleIsCheckable: (options: {
            inputId: string | number | symbol;
            isCheckable: boolean;
        }) => void;
        refreshForm: (initialValuesByInputId?: Partial<{
            [x: string]: T_ValueTypes[any]["blankValue"];
            [x: number]: T_ValueTypes[any]["blankValue"];
        }> | undefined, isCheckableByInputId?: Partial<Record<string | number | symbol, boolean>> | undefined, serverErrorsByInputId?: Partial<Record<string | number | symbol, string[]>> | undefined) => void;
    } & {
        allInputIds: (string | number | symbol)[];
        localErrorInputIds: (string | number | symbol)[];
        serverErrorInputIds: (string | number | symbol)[];
        checkableInputIds: (string | number | symbol)[];
        focusedInputId: string | number | symbol;
        inputStates: {
            [x: string]: {
                inputId: string;
                valueType: any;
                value: any;
                initialValue: any;
                validatorTypes: any[];
                validatorsOptions: Record<any, any>;
                localErrorTypes: any[];
                localErrorTextByErrorType: Record<string, string>;
                serverErrorTexts: string[];
                timeUpdated: number;
                timeBecameCheckable: number;
                timeBecameUncheckable: number;
                timeFocused: number;
                timeUnfocused: number;
                isValidLocal: boolean;
                isValidServer: boolean;
                isValid: boolean;
                isEdited: boolean;
                hasBeenUnfocused: boolean;
                isFocused: boolean;
                isCheckable: boolean;
            };
            [x: number]: {
                inputId: number;
                valueType: any;
                value: any;
                initialValue: any;
                validatorTypes: any[];
                validatorsOptions: Record<any, any>;
                localErrorTypes: any[];
                localErrorTextByErrorType: Record<string, string>;
                serverErrorTexts: string[];
                timeUpdated: number;
                timeBecameCheckable: number;
                timeBecameUncheckable: number;
                timeFocused: number;
                timeUnfocused: number;
                isValidLocal: boolean;
                isValidServer: boolean;
                isValid: boolean;
                isEdited: boolean;
                hasBeenUnfocused: boolean;
                isFocused: boolean;
                isCheckable: boolean;
            };
        };
        formValues: {
            [x: string]: any;
            [x: number]: any;
        };
        timeUpdated: number;
        timeRefreshed: number;
        timeFocused: number;
        timeUnfocused: number;
        isFocused: boolean;
        isEdited: boolean;
        isValid: boolean;
        isValidLocal: boolean;
        isValidServer: boolean;
        hasBeenUnfocused: boolean;
        isCheckable: boolean;
    };
} & {
    validatorOptions: T_CustomOptions;
}) => ValidatorReturn;
export declare function makeValidatorFunction<T_CustomOptions extends Record<any, any>>(validatorFunction: (options: ValidatorParams<any> & {
    validatorOptions: T_CustomOptions;
}) => ValidatorReturn): (options: ValidatorParams<any> & {
    validatorOptions: T_CustomOptions;
}) => ValidatorReturn;
export declare function makeValidatorUtils<T_CustomRegexesByName extends Record<string, RegExp>>(customRegexes?: T_CustomRegexesByName): {
    isString: (value: InputValue<any, any, any>) => value is string;
    isTypedString: (value: InputValue<any, any, any>) => value is string;
    stringMatches: (value: InputValue<any, any, any>, regexName: T_CustomRegexesByName extends Record<string, RegExp> ? keyof T_CustomRegexesByName | "email" | "aNumber" | "aNonNumber" | "anUppercaseLetter" | "aLowercaseLetter" | "aSpace" : "email" | "aNumber" | "aNonNumber" | "anUppercaseLetter" | "aLowercaseLetter" | "aSpace") => value is string;
    stringDoesntMatch: (value: InputValue<any, any, any>, regexName: T_CustomRegexesByName extends Record<string, RegExp> ? keyof T_CustomRegexesByName | "email" | "aNumber" | "aNonNumber" | "anUppercaseLetter" | "aLowercaseLetter" | "aSpace" : "email" | "aNumber" | "aNonNumber" | "anUppercaseLetter" | "aLowercaseLetter" | "aSpace") => value is string;
};
