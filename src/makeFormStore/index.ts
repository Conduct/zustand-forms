import create from "zustand";
import produce from "immer";
import {
  MakeInputsOptions,
  UntypedValidatorFunctions,
  UntypedValueTypes,
  CheckValidatorOptions,
} from "./types";
import { defaultInputState } from "./consts";
import { objectAssign } from "./utils";

export default function makeMakeFormStore<
  T_ValidatorFunctions extends UntypedValidatorFunctions,
  T_ValueTypes extends UntypedValueTypes<keyof T_ValidatorFunctions>
>(validatorFunctions: T_ValidatorFunctions, valueTypes: T_ValueTypes) {
  type ValidatorType = keyof typeof validatorFunctions;
  type ValueType = keyof typeof valueTypes;

  function makeFormStore<
    T_MakeInputsOptions extends MakeInputsOptions<
      T_ValueTypes,
      ValidatorType,
      T_ValidatorFunctions,
      ValueType
    >
  >(makeInputsOptions: T_MakeInputsOptions) {
    // ------------------------------------------
    //  Internal types
    // types are defined  here instead of types.ts to get simple access to
    // the parameters types like makeInputsOptions, valueTypes and validatorFunctions
    // ------------------------------------------
    type Form_InputId = keyof T_MakeInputsOptions;

    // Validators
    type CustomValidatorParams<
      T_ValidatorType extends ValidatorType
    > = CheckValidatorOptions<
      Parameters<T_ValidatorFunctions[T_ValidatorType]>[0]
    >["validatorOptions"];
    type ValidatorOptionsByValidatorType = {
      [P_ValidatorType in ValidatorType]: CustomValidatorParams<
        P_ValidatorType
      >;
    };
    type ValidatorsOptions = Partial<ValidatorOptionsByValidatorType>;

    // Input states
    type InputValueFromValueType<
      T_ValueType extends ValueType
    > = T_ValueTypes[T_ValueType]["blankValue"];

    type InputValueFromOptions<
      K_InputIdParam extends Form_InputId
    > = InputValueFromValueType<
      T_MakeInputsOptions[K_InputIdParam]["valueType"]
    >;

    type InputState<K_InputId extends Form_InputId> = {
      inputId: K_InputId;
      // values
      valueType: T_MakeInputsOptions[K_InputId]["valueType"];
      value: InputValueFromOptions<K_InputId>;
      initialValue: InputValueFromOptions<K_InputId>;
      // validators
      validatorTypes: ValidatorType[];
      validatorsOptions: ValidatorsOptions;
      // current errors
      localErrorTypes: ValidatorType[];
      localErrorTextByErrorType: Record<ValidatorType, string>;
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

    type FormInputStates<> = {
      [K_InputId in Form_InputId]: InputState<K_InputId>;
    };

    type FormValues = {
      [K_InputId in Form_InputId]: InputState<K_InputId>["value"];
    };

    // Form store state and actions
    type FormStoreState<T_InputId extends Form_InputId> = {
      allInputIds: T_InputId[];
      localErrorInputIds: T_InputId[];
      serverErrorInputIds: T_InputId[];
      checkableInputIds: T_InputId[];
      focusedInputId: T_InputId | "";
      inputStates: {
        [P_InputId in T_InputId]: InputState<P_InputId>;
      };
      formValues: {
        [P_InputId in T_InputId]: InputValueFromOptions<P_InputId>;
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

    type FormStoreActions<T_InputId extends Form_InputId> = {
      updateInput: <K_InputIdParam extends Form_InputId>(options: {
        inputId: K_InputIdParam;
        newValue: InputValueFromOptions<K_InputIdParam>;
      }) => void;
      toggleFocus: (options: {
        inputId: T_InputId;
        isFocused: boolean;
      }) => void;
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
              T_MakeInputsOptions[P_InputId]["valueType"]
            >;
          }
        >,
        isCheckableByInputId?: Partial<Record<T_InputId, boolean>>,
        serverErrorsByInputId?: Partial<Record<T_InputId, string[]>>
      ) => void;
      // getInputProps
    };

    type FormStore = FormStoreActions<Form_InputId> &
      FormStoreState<Form_InputId>;

    // ------------------------------------------
    //  Internal utils (using internal types)
    // ------------------------------------------

    function getDraftInputState<
      T_DraftState extends FormStore,
      T_InputId extends Form_InputId
    >(draftState: T_DraftState, inputId: T_InputId) {
      return draftState.inputStates[inputId] as InputState<T_InputId>;
    }

    function getCheckableInputIds(draftState: FormStore) {
      return draftState.allInputIds.filter(
        (loopedInputId) => draftState.inputStates[loopedInputId].isCheckable
      );
    }

    function getLocalInvalidInputIds(draftState: FormStore) {
      return draftState.allInputIds.filter((loopedInputId) => {
        const inputState = draftState.inputStates[loopedInputId];
        return !inputState.isValidLocal && inputState.isCheckable;
      });
    }

    function getServerInvalidInputIds(draftState: FormStore) {
      return draftState.allInputIds.filter((loopedInputId) => {
        const inputState = draftState.inputStates[loopedInputId];
        return !inputState.isValidServer && inputState.isCheckable;
      });
    }

    function getIsFormEdited(draftState: FormStore) {
      return draftState.allInputIds.some(
        (inputId) => draftState.inputStates[inputId].isEdited
      );
    }

    function getIsInputEdited({
      inputId,
      draftState,
    }: {
      inputId: Form_InputId;
      draftState: FormStore;
    }) {
      const inputState = draftState.inputStates[inputId];
      return inputState.value !== inputState.initialValue;
    }

    // updates draftState directly
    function updateDraftFormValidationState(draftState: FormStore) {
      const localInvalidInputIds = getLocalInvalidInputIds(draftState);
      draftState.localErrorInputIds = localInvalidInputIds;
      draftState.isValidLocal = localInvalidInputIds.length === 0;

      const serverInvalidInputIds = getServerInvalidInputIds(draftState);
      draftState.serverErrorInputIds = serverInvalidInputIds;
      draftState.isValidServer = serverInvalidInputIds.length === 0;

      draftState.isValid = draftState.isValidLocal && draftState.isValidServer;
    }

    // getLocalValidationInfoForInput
    type InputValidationInfo = {
      errorTypes: ValidatorType[];
      errorTextsByErrorType: Record<ValidatorType, string>;
      editedValue?: InputValueFromOptions<Form_InputId>;
    };
    type ValidationInfoByInputId = Record<Form_InputId, InputValidationInfo>;

    function getLocalValidationInfoForInput({
      inputId,
      draftState,
      validationInfoByInputId = {} as Record<Form_InputId, InputValidationInfo>,
      originalInputId,
    }: {
      inputId: Form_InputId;
      draftState: FormStore;
      validationInfoByInputId?: ValidationInfoByInputId; // using a shared object to add to each time another input validates recursively
      originalInputId?: Form_InputId; // keeping track of original input when recursively validating other inputs
    }) {
      const inputState = getDraftInputState(draftState, inputId);
      if (!inputState.isCheckable) return validationInfoByInputId;
      if (!validationInfoByInputId[inputId]) {
        validationInfoByInputId[inputId] = {
          errorTypes: [],
          errorTextsByErrorType: {} as Record<ValidatorType, string>,
          editedValue: undefined,
        };
      }
      const inputValidationInfo = validationInfoByInputId[inputId as string];

      const valueToCheck = inputValidationInfo.editedValue ?? inputState.value;

      for (const validatorType of inputState.validatorTypes) {
        const errorResult = validatorFunctions[validatorType]({
          inputId,
          formState: draftState,
          inputState,
          value: valueToCheck,
          // NOTE: using any to remove internal typescript warning, still typed externally
          validatorOptions: (inputState.validatorsOptions[validatorType] ||
            {}) as any,
        });

        if (errorResult) {
          if (typeof errorResult === "string") {
            inputValidationInfo.errorTypes.push(validatorType);
            inputValidationInfo.errorTextsByErrorType[
              validatorType as ValidatorType
            ] = errorResult;
          } else {
            // check if there's any edit values
            if (errorResult.editedValue !== undefined) {
              inputValidationInfo.editedValue = errorResult.editedValue;

              // NOTE: may cause an infinite loop?
              if (errorResult.editedValue !== valueToCheck) {
                // revalidate if the input was edited
                getLocalValidationInfoForInput({
                  inputId,
                  draftState,
                  validationInfoByInputId,
                });
              }
            }

            // only continue with validating if the value wasn't just edited
            // (the edited value sill gets validated inside getLocalValidationInfoForInput() above)
            // This step prevents an error showing for a value that was already fixed with editedValue
            // e.g "abcd" (error must be under 4 letters) -> editedValue :"abc" (no error)
            const hasAnEditedValue =
              inputValidationInfo.editedValue !== undefined;
            const editedValueWasJustChanged =
              errorResult.editedValue !== valueToCheck;
            const canContinueValidatingInput =
              !hasAnEditedValue || !editedValueWasJustChanged;

            if (canContinueValidatingInput) {
              if (errorResult.message) {
                inputValidationInfo.errorTypes.push(validatorType);
                inputValidationInfo.errorTextsByErrorType[
                  validatorType as ValidatorType
                ] = errorResult.message;
              }

              if (errorResult.revalidateOtherInputIds) {
                errorResult.revalidateOtherInputIds.forEach((loopedInputId) => {
                  if (loopedInputId !== originalInputId) {
                    getLocalValidationInfoForInput({
                      inputId: loopedInputId,
                      originalInputId: originalInputId
                        ? originalInputId
                        : inputId,
                      draftState,
                      validationInfoByInputId,
                    });
                  }

                  // if there's an originalInputId prop, use that,
                  // otherwise if this is the original input checked, use the inputId prop
                  // originalInputId avoids infinite loops if another input tries to revalidate this original input
                });
              }
            }
          }
        }
      }
      return validationInfoByInputId;
    }

    function revalidateInputInPlace({
      inputId,
      draftState,
    }: {
      inputId: Form_InputId;
      draftState: FormStore;
    }) {
      const currentTime = Date.now();
      const draftInputState = getDraftInputState(draftState, inputId);

      const validationInfoByInputId = getLocalValidationInfoForInput({
        inputId,
        draftState,
      });

      const updatedInputIds = Object.keys(
        validationInfoByInputId
      ) as Form_InputId[];

      updatedInputIds.forEach((loopedInputId) => {
        const loopedDraftInputState = getDraftInputState(
          draftState,
          loopedInputId
        );

        const loopedValidationInfo = validationInfoByInputId[loopedInputId];
        if (loopedValidationInfo.editedValue !== undefined) {
          // update the inputs value
          objectAssign(draftInputState, {
            value: loopedValidationInfo.editedValue,
            timeUpdated: currentTime,
          });
          draftState.formValues[loopedInputId] =
            loopedValidationInfo.editedValue;
          draftState.timeUpdated = currentTime;
          // check if the input was edited from the original value
          loopedDraftInputState.isEdited = getIsInputEdited({
            inputId: loopedInputId,
            draftState,
          });
        }
        // update validation values

        objectAssign(loopedDraftInputState, {
          localErrorTypes: loopedValidationInfo.errorTypes,
          localErrorTextByErrorType: loopedValidationInfo.errorTextsByErrorType,
          isValidLocal: loopedValidationInfo.errorTypes.length === 0,
          isValidServer:
            loopedDraftInputState.serverErrorTexts.length === 0 ||
            (loopedDraftInputState.serverErrorTexts.length > 0 &&
              loopedDraftInputState.isEdited),
        });

        loopedDraftInputState.isValid =
          loopedDraftInputState.isValidLocal &&
          loopedDraftInputState.isValidServer;
      });
    }

    // ------------------------------------------
    //  Initialising zustand store states
    // ------------------------------------------
    const inputIds: Form_InputId[] = Object.keys(makeInputsOptions);

    const initialInputStates = inputIds.reduce((editedObject, inputId) => {
      const inputOptions = makeInputsOptions[inputId];
      const valueType = inputOptions.valueType as ValueType;
      const initialValue =
        inputOptions.defaultInitialValue || valueTypes[valueType].blankValue;

      const validatorTypes = [
        ...(valueTypes[valueType].defaultValidators ?? []),
        ...(inputOptions.defaultValidators ?? []),
      ];

      const validatorsOptions = {
        ...(valueTypes[valueType].defaultValidatorsOptions ?? {}),
        ...(inputOptions.defaultValidatorsOptions ?? {}),
      };

      return {
        ...editedObject,
        [inputId]: {
          ...(defaultInputState as InputState<Form_InputId>),
          inputId,
          valueType,
          value: initialValue,
          initialValue,
          validatorTypes,
          validatorsOptions,
        } as InputState<typeof inputId>,
      };
    }, {} as FormInputStates);

    const initialFormValues = inputIds.reduce((editedObject, inputId) => {
      const inputOptions = makeInputsOptions[inputId];
      const valueType = inputOptions.valueType as ValueType;
      const initialValue =
        inputOptions.defaultInitialValue || valueTypes[valueType].blankValue;

      return {
        ...editedObject,
        [inputId]: initialValue,
      };
    }, {} as FormValues);

    return create<FormStore>((set, get) => {
      // (not in utils becuase it needs access to "set()")
      function _setImmutable(editDraftState: (draftState: FormStore) => void) {
        // NOTE make sure to use outside of loops (not inside) so it only runs "set" once
        // NOTE: this can also work as (editDraftStateFunction) => set(produce(editDraftStateFunction))
        //       but using the longer version to be more understandable
        set((baseState) => {
          const nextState = produce(baseState, (draftState) => {
            // NOTE when using the draftState default type, this error occurs
            // "Expression produces a union type that is too complex to represent" so retyping it here
            const retypedDraftState = draftState as unknown;
            editDraftState(retypedDraftState as FormStore);
          });
          return nextState;
        });
      }

      return {
        allInputIds: inputIds,
        localErrorInputIds: [],
        serverErrorInputIds: [],
        checkableInputIds: [],
        focusedInputId: "",
        inputStates: initialInputStates,
        formValues: initialFormValues,
        // times
        timeUpdated: 0,
        timeRefreshed: 0,
        timeFocused: 0,
        timeUnfocused: 0,
        // booleans
        isFocused: false,
        isEdited: false,
        isValid: true,
        isValidLocal: false,
        isValidServer: false,
        hasBeenUnfocused: false,
        isCheckable: true,

        // functions

        updateInput({ inputId, newValue }) {
          _setImmutable((draftState) => {
            const draftInputState = getDraftInputState(draftState, inputId);
            const currentTime = Date.now();
            // update the inputs value
            draftInputState.value = newValue;
            draftInputState.timeUpdated = currentTime;
            draftState.formValues[inputId] = newValue;
            draftState.timeUpdated = currentTime;
            // check if the input was edited from the original value
            draftInputState.isEdited = getIsInputEdited({
              inputId,
              draftState,
            });

            revalidateInputInPlace({ draftState, inputId });

            draftState.isEdited = getIsFormEdited(draftState);
            updateDraftFormValidationState(draftState);
          });
        },
        toggleFocus({ inputId, isFocused: newIsFocused }) {
          const currentTime = Date.now();

          _setImmutable((draftState) => {
            const draftInputState = getDraftInputState(draftState, inputId);

            draftInputState.isFocused = newIsFocused;

            if (newIsFocused) {
              draftInputState.timeFocused = currentTime;
              objectAssign(draftState, {
                focusedInputId: inputId,
                isFocused: true,
                timeFocused: currentTime,
              });
            } else {
              objectAssign(draftInputState, {
                hasBeenUnfocused: true,
                timeUnfocused: currentTime,
              });
            }
          });
          // set the form as unfocused if no new inputs have been focused after this unfocused
          if (!newIsFocused) {
            setTimeout(() => {
              if (get().focusedInputId === inputId) {
                _setImmutable((draftState) => {
                  objectAssign(draftState, {
                    focusedInputId: "",
                    isFocused: false,
                    timeUnfocused: currentTime, // NOTE this uses the time before the timeout, might need to change
                    hasBeenUnfocused: true,
                  });
                });
              }
            }, 50); // NOTE if there's issues with inputs not focusing quick enough, this can be increased
          }
        },
        toggleIsCheckable({ inputId, isCheckable: newIsCheckable }) {
          const baseState = get();
          const { inputStates } = baseState;
          const baseInputState = inputStates[inputId];
          const currentTime = Date.now();

          _setImmutable((draftState) => {
            const draftInputState = getDraftInputState(draftState, inputId);

            draftInputState.isCheckable = newIsCheckable;

            revalidateInputInPlace({ draftState, inputId });

            if (newIsCheckable !== baseInputState.isCheckable) {
              const checkableInputIds = getCheckableInputIds(draftState);

              objectAssign(draftState, {
                checkableInputIds: checkableInputIds,
                isCheckable: checkableInputIds.length > 0,
              });

              if (newIsCheckable) {
                draftInputState.timeBecameCheckable = currentTime;
              } else {
                draftInputState.timeBecameUncheckable = currentTime;
              }
            }
            updateDraftFormValidationState(draftState);
          });
        },
        refreshForm(
          initialValuesByInputId,
          isCheckabByInputId,
          serverErrorsByInputId
        ) {
          // make sure to validate each input while setting the inital values
          // initialValuesByInputId

          const baseState = get();
          const { inputStates } = baseState;
          const currentTime = Date.now();

          _setImmutable((draftState) => {
            for (const inputId of baseState.allInputIds) {
              type K_LoopedInputId = typeof inputId;

              const draftInputState = getDraftInputState(draftState, inputId);
              const baseInputState = inputStates[inputId];

              const newInitialValue = (initialValuesByInputId?.[inputId] ??
                makeInputsOptions[inputId].defaultInitialValue ??
                valueTypes[baseInputState.valueType]
                  .blankValue) as InputValueFromOptions<K_LoopedInputId>;

              const newServerErrors =
                serverErrorsByInputId?.[inputId] ?? ([] as string[]);

              const newIsCheckable =
                isCheckabByInputId?.[inputId] ??
                makeInputsOptions[inputId].defaultIsCheckable ??
                true;

              objectAssign(draftInputState, {
                isCheckable: newIsCheckable,
                initialValue: newInitialValue,
                value: newInitialValue,
                timeUpdated: currentTime,
                isEdited: false,
                hasBeenUnfocused: false,
                isFocused: false,
                serverErrorTexts: newServerErrors,
                timeBecameCheckable: newIsCheckable
                  ? currentTime
                  : draftInputState.timeBecameCheckable,
                timeBecameUncheckable: newIsCheckable
                  ? draftInputState.timeBecameUncheckable
                  : currentTime,
              });

              revalidateInputInPlace({ draftState, inputId });
            }

            updateDraftFormValidationState(draftState);

            objectAssign(draftState, {
              isCheckable: true,
              timeUpdated: currentTime,
              timeFocused: 0,
              timeUnfocused: 0,
              hasBeenUnfocused: false,
            });
          });
        },
      };
    });
  }

  return makeFormStore;
}
