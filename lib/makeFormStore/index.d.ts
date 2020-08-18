import { MakeInputsOptions, UntypedValidatorFunctions, UntypedValueTypes, CheckValidatorOptions } from "./types";
export default function makeMakeFormStore<T_ValidatorFunctions extends UntypedValidatorFunctions, T_ValueTypes extends UntypedValueTypes<keyof T_ValidatorFunctions>>(validatorFunctions: T_ValidatorFunctions, valueTypes: T_ValueTypes): <T_MakeInputsOptions extends MakeInputsOptions<T_ValueTypes, keyof T_ValidatorFunctions, T_ValidatorFunctions, keyof T_ValueTypes>>(makeInputsOptions: T_MakeInputsOptions) => import("zustand").UseStore<{
    updateInput: <K_InputIdParam extends keyof T_MakeInputsOptions>(options: {
        inputId: K_InputIdParam;
        newValue: T_ValueTypes[T_MakeInputsOptions[K_InputIdParam]["valueType"]]["blankValue"];
    }) => void;
    toggleFocus: (options: {
        inputId: keyof T_MakeInputsOptions;
        isFocused: boolean;
    }) => void;
    toggleIsCheckable: (options: {
        inputId: keyof T_MakeInputsOptions;
        isCheckable: boolean;
    }) => void;
    refreshForm: (initialValuesByInputId?: Partial<{ [P_InputId in keyof T_MakeInputsOptions]: T_ValueTypes[T_MakeInputsOptions[P_InputId]["valueType"]]["blankValue"]; }> | undefined, isCheckableByInputId?: Partial<Record<keyof T_MakeInputsOptions, boolean>> | undefined, serverErrorsByInputId?: Partial<Record<keyof T_MakeInputsOptions, string[]>> | undefined) => void;
} & {
    allInputIds: (keyof T_MakeInputsOptions)[];
    localErrorInputIds: (keyof T_MakeInputsOptions)[];
    serverErrorInputIds: (keyof T_MakeInputsOptions)[];
    checkableInputIds: (keyof T_MakeInputsOptions)[];
    focusedInputId: "" | keyof T_MakeInputsOptions;
    inputStates: { [P_InputId_1 in keyof T_MakeInputsOptions]: {
        inputId: P_InputId_1;
        valueType: T_MakeInputsOptions[P_InputId_1]["valueType"];
        value: T_ValueTypes[T_MakeInputsOptions[P_InputId_1]["valueType"]]["blankValue"];
        initialValue: T_ValueTypes[T_MakeInputsOptions[P_InputId_1]["valueType"]]["blankValue"];
        validatorTypes: (keyof T_ValidatorFunctions)[];
        validatorsOptions: Partial<{ [P_ValidatorType in keyof T_ValidatorFunctions]: CheckValidatorOptions<Parameters<T_ValidatorFunctions[P_ValidatorType]>[0]>["validatorOptions"]; }>;
        localErrorTypes: (keyof T_ValidatorFunctions)[];
        localErrorTextByErrorType: Record<keyof T_ValidatorFunctions, string>;
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
    }; };
    formValues: { [P_InputId_2 in keyof T_MakeInputsOptions]: T_ValueTypes[T_MakeInputsOptions[P_InputId_2]["valueType"]]["blankValue"]; };
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
}>;
