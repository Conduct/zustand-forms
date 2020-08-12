// Mostly external types for function parameters and validators
// and some shared typeds
// TODO Clean up names like "Untyped_" to be consistant
/*
exported types:

MakeInputsOptions,
UntypedValidatorFunctions,
UntypedValueTypes,
ValidatorParams,
ValidatorReturn
InputValue,
InputValueFromOptions
CheckValidatorOptions
*/

export type AnyKey = string | number | symbol;

type ValueTypes<
  T_ValidatorType extends AnyKey,
  T_ValueType extends AnyKey
> = Record<T_ValueType, UntypedValueType<T_ValidatorType>>;

type InputValueFromValueType<
  T_ValueTypes extends ValueTypes<T_ValidatorType, K_ValueType>,
  T_ValidatorType extends AnyKey,
  K_ValueType extends AnyKey
> = T_ValueTypes[K_ValueType]["blankValue"];

export type InputValue<
  T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends AnyKey
> = {
  [K in T_ValueType]: InputValueFromValueType<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >;
}[T_ValueType];

type MakeInputsOptionsItemFromValueType<
  T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>,
  T_ValidatorType extends keyof T_ValidatorFunctions,
  T_ValidatorFunctions extends UntypedValidatorFunctions,
  T_ValueType extends AnyKey
> = {
  valueType: T_ValueType;
  defaultInitialValue?: InputValueFromValueType<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >;
  defaultValidators?: T_ValidatorType[];
  defaultValidatorsOptions?: Typed_ValidatorsOptions<
    T_ValidatorType,
    T_ValidatorFunctions
  >;
  defaultIsCheckable?: boolean;
};

type MakeInputsOptionsItem<
  T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>,
  T_ValidatorType extends keyof T_ValidatorFunctions,
  T_ValidatorFunctions extends UntypedValidatorFunctions,
  T_ValueType extends AnyKey
> = {
  [K in T_ValueType]: MakeInputsOptionsItemFromValueType<
    T_ValueTypes,
    T_ValidatorType,
    T_ValidatorFunctions,
    T_ValueType
  >;
}[T_ValueType];

export type MakeInputsOptions<
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends keyof T_ValidatorFunctions,
  T_ValidatorFunctions extends UntypedValidatorFunctions,
  T_ValueType extends keyof T_ValueTypes
> = {
  [inputId: string]: MakeInputsOptionsItem<
    T_ValueTypes,
    T_ValidatorType,
    T_ValidatorFunctions,
    T_ValueType
  >;
};

// export type Make_Inputs_Options<T_ValueType> = Record<
//   string,
//   MakeInputsOptionsItemFromValueType<T_ValueType>
// >;

// ---------------------------

type Make_Inputs_OptionsItemFromValueType<
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends keyof T_ValueTypes
> = {
  valueType: keyof T_ValueTypes;
  defaultInitialValue?: T_ValueTypes[T_ValueType]["blankValue"];
  defaultValidators?: T_ValidatorType[];
  defaultValidatorsOptions?: ValidatorsOptions;
  defaultIsCheckable?: boolean;
};

export type Make_Inputs_Options<
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends keyof T_ValueTypes
> = Record<
  string,
  Make_Inputs_OptionsItemFromValueType<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >
>;

// -----------------------------

// Validators

type ValidatorFunctionParams<
  K_InputId extends keyof T_MakeInputsOptions,
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends keyof T_ValueTypes,
  T_MakeInputsOptions extends Make_Inputs_Options<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >
> = {
  value: InputValue<T_ValueTypes, T_ValidatorType, T_ValueType>;
  inputId: K_InputId;
  inputState: Untyped_InputState<
    K_InputId,
    T_MakeInputsOptions,
    T_ValidatorType
  >;
  formState: UntypedFormStore<
    // K_InputId,
    T_MakeInputsOptions,
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >;
  // validatorOptions?: any; // this type is added by each validator function
};

// untyped
type CustomValidatorParams<
  T_ValidatorType extends AnyKey
> = CheckValidatorOptions<
  Parameters<ReturnType<GetValidatorFunctions_Untyped>[T_ValidatorType]>[0]
>["validatorOptions"];

type ValidatorOptionsByValidatorType = Record<
  string,
  CustomValidatorParams<string>
>;

type ValidatorsOptions = Partial<ValidatorOptionsByValidatorType>;

// ----------------

type Typed_ValidatorsOptions<
  T_ValidatorType extends keyof T_ValidatorFunctions,
  T_ValidatorFunctions extends UntypedValidatorFunctions
> = Partial<
  Typed_ValidatorOptionsByValidatorType<T_ValidatorType, T_ValidatorFunctions>
>;

type Typed_ValidatorOptionsByValidatorType<
  T_ValidatorType extends keyof T_ValidatorFunctions,
  T_ValidatorFunctions extends UntypedValidatorFunctions
> = {
  [P_ValidatorType in T_ValidatorType]: Typed_CustomValidatorParams<
    P_ValidatorType,
    T_ValidatorFunctions
  >;
};

type Typed_CustomValidatorParams<
  // T_ValidatorType extends ValidatorType
  T_ValidatorType extends keyof T_ValidatorFunctions,
  T_ValidatorFunctions extends UntypedValidatorFunctions
> = CheckValidatorOptions<
  Parameters<T_ValidatorFunctions[T_ValidatorType]>[0]
>["validatorOptions"];

// (basic validator types)

type ValidatorReturn_Untyped = {
  message?: string;
  editedValue?: any; // InputValue<T_ValueTypes, T_ValidatorType, T_ValueType>;
  revalidateOtherInputIds?: string[];
};

type GetValidatorFunctions_Untyped = () => Record<
  AnyKey,
  (params: any) => ValidatorReturn_Untyped
>;
export type UntypedValidatorFunctions = Record<
  string,
  (params: any) => ValidatorReturn
>;

export type ValidatorParams<
  T_ValueTypes extends UntypedValueTypes<any>
> = ValidatorFunctionParams<any, T_ValueTypes, any, keyof T_ValueTypes, any>;
type DetailedValidatorReturn = {
  message?: string; // no message means the input is valid, but the other details are needed from the validator
  editedValue?: InputValue<any, any, any>; // or when the validator changes a value, like limiting characters
  revalidateOtherInputIds?: string[]; // for when other inputs should revalidate
};
export type ValidatorReturn = string | DetailedValidatorReturn | undefined; // message, details object or  undefined
// undefined means valid

// Input states

export type InputValueFromOptions<
  T_MakeInputsOptions extends Make_Inputs_Options<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >,
  T_ValueTypes extends ValueTypes<T_ValidatorType, T_ValueType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends AnyKey,
  K_InputIdParam extends keyof T_MakeInputsOptions
> = InputValueFromValueType<
  T_ValueTypes,
  T_ValidatorType,
  T_MakeInputsOptions[K_InputIdParam]["valueType"]
>;

// --------

type Untyped_InputState<
  K_InputId extends keyof T_MakeInputsOptions,
  T_MakeInputsOptions extends Make_Inputs_Options<any, any, any>,
  T_ValidatorType extends AnyKey
> = {
  inputId: K_InputId;
  // values
  valueType: T_MakeInputsOptions[K_InputId]["valueType"];
  value: InputValueFromOptions<T_MakeInputsOptions, any, any, any, K_InputId>;
  initialValue: InputValueFromOptions<
    T_MakeInputsOptions,
    any,
    any,
    any,
    K_InputId
  >;
  // validators
  validatorTypes: T_ValidatorType[];
  validatorsOptions: Record<T_ValidatorType, any>;
  // validatorsOptions: ValidatorsOptions;
  // current errors
  localErrorTypes: T_ValidatorType[];
  // localErrorTextByErrorType: Record<T_ValidatorType, string>;
  localErrorTextByErrorType: Record<string, string>;
  serverErrorTexts: string[];
  // times
  timeUpdated: number;
  timeBecameCheckable: number; // whenever the input becomes visible
  timeBecameUncheckable: number; // whenever the input becomes hidden
  timeFocused: number;
  timeUnfocused: number;
  // booleans
  isValidLocal: boolean;
  isValidServer: boolean;
  isValid: boolean;
  isEdited: boolean;
  hasBeenUnfocused: boolean;
  isFocused: boolean;
  isCheckable: boolean;
};

type UntypedFormStoreState<
  T_InputId extends keyof T_MakeInputsOptions,
  T_MakeInputsOptions extends Make_Inputs_Options<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >,
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends keyof T_ValueTypes
> = {
  allInputIds: T_InputId[];
  localErrorInputIds: T_InputId[];
  serverErrorInputIds: T_InputId[];
  checkableInputIds: T_InputId[];
  focusedInputId: T_InputId | "";
  inputStates: {
    [P_InputId in T_InputId]: Untyped_InputState<
      P_InputId,
      T_MakeInputsOptions,
      T_ValidatorType
    >;
  };
  formValues: {
    [P_InputId in T_InputId]: any;
  };
  //
  timeUpdated: number;
  timeRefreshed: number; // whenever the initialValues (or serverErrors) are updated
  timeFocused: number;
  timeUnfocused: number;
  // booleans
  isFocused: boolean;
  isEdited: boolean;
  isValid: boolean;
  isValidLocal: boolean;
  isValidServer: boolean;
  hasBeenUnfocused: boolean;
  isCheckable: boolean;
};
//
type UntypedFormStoreActions<
  T_InputId extends keyof T_MakeInputsOptions,
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends keyof T_ValueTypes,
  T_MakeInputsOptions extends Make_Inputs_Options<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >
> = {
  updateInput: <K_InputIdParam extends keyof T_MakeInputsOptions>(options: {
    inputId: K_InputIdParam;
    newValue: InputValueFromOptions<
      T_MakeInputsOptions,
      any,
      any,
      any,
      K_InputIdParam
    >;
  }) => void;
  toggleFocus: (options: { inputId: T_InputId; isFocused: boolean }) => void;
  toggleIsCheckable: (options: {
    inputId: T_InputId;
    isCheckable: boolean;
  }) => void;
  // TODO the InputValue could be typed based on the inputId and the initial options?
  refreshForm: (
    // initialValuesByInputId?: Partial<Record<K_InputId, InputValue>>,
    initialValuesByInputId?: Partial<
      {
        [P_InputId in T_InputId]: InputValueFromValueType<
          T_ValueTypes,
          T_ValidatorType,
          T_MakeInputsOptions[P_InputId]["valueType"]
        >;
      }
    >,
    isCheckableByInputId?: Partial<Record<T_InputId, boolean>>,
    serverErrorsByInputId?: Partial<Record<T_InputId, string[]>>
  ) => void;
  // getInputProps
};

type UntypedFormStore<
  T_MakeInputsOptions extends Make_Inputs_Options<
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >,
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>,
  T_ValidatorType extends AnyKey,
  T_ValueType extends keyof T_ValueTypes
> = UntypedFormStoreActions<
  keyof T_MakeInputsOptions,
  T_ValueTypes,
  T_ValidatorType,
  T_ValueType,
  T_MakeInputsOptions
> &
  UntypedFormStoreState<
    keyof T_MakeInputsOptions,
    T_MakeInputsOptions,
    T_ValueTypes,
    T_ValidatorType,
    T_ValueType
  >;

type UntypedValueType<T_ValidatorType extends AnyKey> = {
  blankValue: any;
  defaultValidators?: T_ValidatorType[];
  defaultValidatorsOptions?: Partial<Record<T_ValidatorType, any>>;
};
export type UntypedValueTypes<T_ValidatorType extends AnyKey> = Record<
  string,
  UntypedValueType<T_ValidatorType>
>;

// --------------------------------------
// for index.ts that don't need the internal types

// Validators
type NoValidatorOptions = { validatorOptions: never };
type HasValidatorOptions =
  | { validatorOptions?: any }
  | { validatorOptions: any };
export type CheckValidatorOptions<
  TheParameters extends any
> = TheParameters extends HasValidatorOptions
  ? TheParameters
  : NoValidatorOptions;
