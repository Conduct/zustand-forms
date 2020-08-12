export declare type AnyKey = string | number | symbol;
declare type ValueTypes<T_ValidatorType extends AnyKey, T_ValueType extends AnyKey> = Record<T_ValueType, UntypedValueType<T_ValidatorType>>;
declare type InputValueFromValueType<T_ValueTypes extends ValueTypes<T_ValidatorType, K_ValueType>, T_ValidatorType extends AnyKey, K_ValueType extends AnyKey> = T_ValueTypes[K_ValueType]["blankValue"];
export declare type InputValue<T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>, T_ValidatorType extends AnyKey, T_ValueType extends AnyKey> = {
    [K in T_ValueType]: InputValueFromValueType<T_ValueTypes, T_ValidatorType, T_ValueType>;
}[T_ValueType];
declare type MakeInputsOptionsItemFromValueType<T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>, T_ValidatorType extends keyof T_ValidatorFunctions, T_ValidatorFunctions extends UntypedValidatorFunctions, T_ValueType extends AnyKey> = {
    valueType: T_ValueType;
    defaultInitialValue?: InputValueFromValueType<T_ValueTypes, T_ValidatorType, T_ValueType>;
    defaultValidators?: T_ValidatorType[];
    defaultValidatorsOptions?: Typed_ValidatorsOptions<T_ValidatorType, T_ValidatorFunctions>;
    defaultIsCheckable?: boolean;
};
declare type MakeInputsOptionsItem<T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>, T_ValidatorType extends keyof T_ValidatorFunctions, T_ValidatorFunctions extends UntypedValidatorFunctions, T_ValueType extends AnyKey> = {
    [K in T_ValueType]: MakeInputsOptionsItemFromValueType<T_ValueTypes, T_ValidatorType, T_ValidatorFunctions, T_ValueType>;
}[T_ValueType];
export declare type MakeInputsOptions<T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends keyof T_ValidatorFunctions, T_ValidatorFunctions extends UntypedValidatorFunctions, T_ValueType extends keyof T_ValueTypes> = {
    [inputId: string]: MakeInputsOptionsItem<T_ValueTypes, T_ValidatorType, T_ValidatorFunctions, T_ValueType>;
};
declare type Make_Inputs_OptionsItemFromValueType<T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends AnyKey, T_ValueType extends keyof T_ValueTypes> = {
    valueType: keyof T_ValueTypes;
    defaultInitialValue?: T_ValueTypes[T_ValueType]["blankValue"];
    defaultValidators?: T_ValidatorType[];
    defaultValidatorsOptions?: ValidatorsOptions;
    defaultIsCheckable?: boolean;
};
export declare type Make_Inputs_Options<T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends AnyKey, T_ValueType extends keyof T_ValueTypes> = Record<string, Make_Inputs_OptionsItemFromValueType<T_ValueTypes, T_ValidatorType, T_ValueType>>;
declare type ValidatorFunctionParams<K_InputId extends keyof T_MakeInputsOptions, T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends AnyKey, T_ValueType extends keyof T_ValueTypes, T_MakeInputsOptions extends Make_Inputs_Options<T_ValueTypes, T_ValidatorType, T_ValueType>> = {
    value: InputValue<T_ValueTypes, T_ValidatorType, T_ValueType>;
    inputId: K_InputId;
    inputState: Untyped_InputState<K_InputId, T_MakeInputsOptions, T_ValidatorType>;
    formState: UntypedFormStore<T_MakeInputsOptions, T_ValueTypes, T_ValidatorType, T_ValueType>;
};
declare type CustomValidatorParams<T_ValidatorType extends AnyKey> = CheckValidatorOptions<Parameters<ReturnType<GetValidatorFunctions_Untyped>[T_ValidatorType]>[0]>["validatorOptions"];
declare type ValidatorOptionsByValidatorType = Record<string, CustomValidatorParams<string>>;
declare type ValidatorsOptions = Partial<ValidatorOptionsByValidatorType>;
declare type Typed_ValidatorsOptions<T_ValidatorType extends keyof T_ValidatorFunctions, T_ValidatorFunctions extends UntypedValidatorFunctions> = Partial<Typed_ValidatorOptionsByValidatorType<T_ValidatorType, T_ValidatorFunctions>>;
declare type Typed_ValidatorOptionsByValidatorType<T_ValidatorType extends keyof T_ValidatorFunctions, T_ValidatorFunctions extends UntypedValidatorFunctions> = {
    [P_ValidatorType in T_ValidatorType]: Typed_CustomValidatorParams<P_ValidatorType, T_ValidatorFunctions>;
};
declare type Typed_CustomValidatorParams<T_ValidatorType extends keyof T_ValidatorFunctions, T_ValidatorFunctions extends UntypedValidatorFunctions> = CheckValidatorOptions<Parameters<T_ValidatorFunctions[T_ValidatorType]>[0]>["validatorOptions"];
declare type ValidatorReturn_Untyped = {
    message?: string;
    editedValue?: any;
    revalidateOtherInputIds?: string[];
};
declare type GetValidatorFunctions_Untyped = () => Record<AnyKey, (params: any) => ValidatorReturn_Untyped>;
export declare type UntypedValidatorFunctions = Record<string, (params: any) => ValidatorReturn>;
export declare type ValidatorParams<T_ValueTypes extends UntypedValueTypes<any>> = ValidatorFunctionParams<any, T_ValueTypes, any, keyof T_ValueTypes, any>;
declare type DetailedValidatorReturn = {
    message?: string;
    editedValue?: InputValue<any, any, any>;
    revalidateOtherInputIds?: string[];
};
export declare type ValidatorReturn = string | DetailedValidatorReturn | undefined;
export declare type InputValueFromOptions<T_MakeInputsOptions extends Make_Inputs_Options<T_ValueTypes, T_ValidatorType, T_ValueType>, T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>, T_ValidatorType extends AnyKey, T_ValueType extends AnyKey, K_InputIdParam extends keyof T_MakeInputsOptions> = InputValueFromValueType<T_ValueTypes, T_ValidatorType, T_MakeInputsOptions[K_InputIdParam]["valueType"]>;
declare type Untyped_InputState<K_InputId extends keyof T_MakeInputsOptions, T_MakeInputsOptions extends Make_Inputs_Options<any, any, any>, T_ValidatorType extends AnyKey> = {
    inputId: K_InputId;
    valueType: T_MakeInputsOptions[K_InputId]["valueType"];
    value: InputValueFromOptions<T_MakeInputsOptions, any, any, any, K_InputId>;
    initialValue: InputValueFromOptions<T_MakeInputsOptions, any, any, any, K_InputId>;
    validatorTypes: T_ValidatorType[];
    validatorsOptions: Record<T_ValidatorType, any>;
    localErrorTypes: T_ValidatorType[];
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
declare type UntypedFormStoreState<T_InputId extends keyof T_MakeInputsOptions, T_MakeInputsOptions extends Make_Inputs_Options<T_ValueTypes, T_ValidatorType, T_ValueType>, T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends AnyKey, T_ValueType extends keyof T_ValueTypes> = {
    allInputIds: T_InputId[];
    localErrorInputIds: T_InputId[];
    serverErrorInputIds: T_InputId[];
    checkableInputIds: T_InputId[];
    focusedInputId: T_InputId | "";
    inputStates: {
        [P_InputId in T_InputId]: Untyped_InputState<P_InputId, T_MakeInputsOptions, T_ValidatorType>;
    };
    formValues: {
        [P_InputId in T_InputId]: any;
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
declare type UntypedFormStoreActions<T_InputId extends keyof T_MakeInputsOptions, T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends AnyKey, T_ValueType extends keyof T_ValueTypes, T_MakeInputsOptions extends Make_Inputs_Options<T_ValueTypes, T_ValidatorType, T_ValueType>> = {
    updateInput: <K_InputIdParam extends keyof T_MakeInputsOptions>(options: {
        inputId: K_InputIdParam;
        newValue: InputValueFromOptions<T_MakeInputsOptions, any, any, any, K_InputIdParam>;
    }) => void;
    toggleFocus: (options: {
        inputId: T_InputId;
        isFocused: boolean;
    }) => void;
    toggleIsCheckable: (options: {
        inputId: T_InputId;
        isCheckable: boolean;
    }) => void;
    refreshForm: (initialValuesByInputId?: Partial<{
        [P_InputId in T_InputId]: InputValueFromValueType<T_ValueTypes, T_ValidatorType, T_MakeInputsOptions[P_InputId]["valueType"]>;
    }>, isCheckableByInputId?: Partial<Record<T_InputId, boolean>>, serverErrorsByInputId?: Partial<Record<T_InputId, string[]>>) => void;
};
declare type UntypedFormStore<T_MakeInputsOptions extends Make_Inputs_Options<T_ValueTypes, T_ValidatorType, T_ValueType>, T_ValueTypes extends UntypedValueTypes<T_ValidatorType>, T_ValidatorType extends AnyKey, T_ValueType extends keyof T_ValueTypes> = UntypedFormStoreActions<keyof T_MakeInputsOptions, T_ValueTypes, T_ValidatorType, T_ValueType, T_MakeInputsOptions> & UntypedFormStoreState<keyof T_MakeInputsOptions, T_MakeInputsOptions, T_ValueTypes, T_ValidatorType, T_ValueType>;
declare type UntypedValueType<T_ValidatorType extends AnyKey> = {
    blankValue: any;
    defaultValidators?: T_ValidatorType[];
    defaultValidatorsOptions?: Partial<Record<T_ValidatorType, any>>;
};
export declare type UntypedValueTypes<T_ValidatorType extends AnyKey> = Record<string, UntypedValueType<T_ValidatorType>>;
declare type NoValidatorOptions = {
    validatorOptions: never;
};
declare type HasValidatorOptions = {
    validatorOptions?: any;
} | {
    validatorOptions: any;
};
export declare type CheckValidatorOptions<TheParameters extends any> = TheParameters extends HasValidatorOptions ? TheParameters : NoValidatorOptions;
export {};
