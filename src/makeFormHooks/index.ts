import useLatestDefined from "../utils/useLatestDefined";
import makeMakeFormStore from "../makeFormStore";
import { InputValueFromOptions } from "../makeFormStore/types";
import { MakeFormStoresHelperTypes } from "../utils/typeHelpers";
import shallow from "zustand/shallow";

type AllFormStoresObject = Record<
  string,
  {
    hook: ReturnType<ReturnType<typeof makeMakeFormStore>>[0];
    api: ReturnType<ReturnType<typeof makeMakeFormStore>>[1];
  }
>;

export function makeFormHooks<T_AllFormStores extends AllFormStoresObject>(
  allFormStores: T_AllFormStores
) {
  type FormStores = typeof allFormStores;
  // type FormName = keyof FormStores; // FormStoresHelperTypes["FormStores"] so it works with the helper types

  type FormStoresHelperTypes = MakeFormStoresHelperTypes<typeof allFormStores>;
  type FormName = FormStoresHelperTypes["FormName"];
  type InputIdByFormName = FormStoresHelperTypes["InputIdByFormName"];

  type AnyFormStoreHookUnion = {
    [K_FormName in FormName]: FormStores[K_FormName]["hook"];
  }[FormName];

  type AnyFormStoreApiUnion = {
    [K_FormName in FormName]: FormStores[K_FormName]["api"];
  }[FormName];

  type AnyFormStoreHook = UnionToIntersection<AnyFormStoreHookUnion>;
  type AnyFormStoreApi = UnionToIntersection<AnyFormStoreApiUnion>;

  // using FormStoresHelperTypes["InputIdByFormName"] so it works with the helper types
  type FormStoreHookFromName<
    T_FormName extends FormName
  > = FormStores[T_FormName]["hook"];

  type InputIdsFromFormName<
    T_FormName extends keyof FormStores
  > = keyof ReturnType<
    FormStores[T_FormName]["api"]["getState"]
  >["inputStates"];

  type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends (k: infer I) => void
    ? I
    : never;

  function useFormInput<
    T_FormName extends FormName,
    T_InputId extends InputIdByFormName[T_FormName]
  >({ formName, inputId }: { inputId: T_InputId; formName: T_FormName }) {
    type T_FormStore = ReturnType<
      typeof allFormStores[typeof formName]["api"]["getState"]
    >;

    const useFormStore = allFormStores[formName].hook;

    const [inputState, updateInput, toggleFocus] = useFormStore(
      (state: T_FormStore) => [
        state.inputStates[inputId],
        state.updateInput,
        state.toggleFocus,
      ],
      shallow
    );

    const {
      isValid,
      isValidServer,
      hasBeenUnfocused,
      localErrorTypes,
      localErrorTextByErrorType,
      serverErrorTexts,
      isFocused,
      isEdited,
      timeUpdated,
      value,
      validatorsOptions,
    } = inputState;

    const hasHadServerErrors = serverErrorTexts.length > 0;
    const canShowServerErrors = !isValidServer;
    const canShowLocalErrors =
      (hasBeenUnfocused && localErrorTypes.length > 0) || hasHadServerErrors;
    const canShowErrors = canShowLocalErrors || canShowServerErrors;

    const valueIsEmpty = (typeof value === "string" && value === "") || false;
    const shouldShowPlaceholder = valueIsEmpty && !isFocused;

    const inlineErrorTexts = [
      ...localErrorTypes.map(
        (errorType: string) => localErrorTextByErrorType[errorType]
      ),
      // adds server error texts after local errors
      ...(canShowServerErrors ? serverErrorTexts : []),
    ];

    const latestVisibleInlineErrorTexts = useLatestDefined({
      value: inlineErrorTexts,
      isDefined: inlineErrorTexts.length > 0,
    });

    // TODO fix the as any types (T_InputId isn't working there)
    return {
      value: inputState.value,
      onChange: (newValue: InputValueFromOptions<any, any, any, any, any>) =>
        updateInput({ inputId, newValue } as any),
      onFocus: () => toggleFocus({ inputId, isFocused: true } as any),
      onBlur: () => toggleFocus({ inputId, isFocused: false } as any),
      isFocused,
      isEdited,
      isValid,
      canShowErrors,
      hasVisibleErrors: canShowErrors && !isValid,
      inlineErrorTexts,
      latestVisibleInlineErrorTexts,
      localErrorTypes,
      localErrorTextByErrorType,
      serverErrorTexts,
      shouldShowPlaceholder,
      validatorsOptions,
      valueIsEmpty,
    };
  }

  return { useFormInput };
}
