var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import useLatestDefined from "../utils/useLatestDefined";
import shallow from "zustand/shallow";
export function makeFormHooks(allFormStores) {
    function useFormInput(_a) {
        var formName = _a.formName, inputId = _a.inputId;
        var useFormStore = allFormStores[formName].hook;
        var _b = useFormStore(function (state) { return [
            state.inputStates[inputId],
            state.updateInput,
            state.toggleFocus,
        ]; }, shallow), inputState = _b[0], updateInput = _b[1], toggleFocus = _b[2];
        var isValid = inputState.isValid, isValidServer = inputState.isValidServer, hasBeenUnfocused = inputState.hasBeenUnfocused, localErrorTypes = inputState.localErrorTypes, localErrorTextByErrorType = inputState.localErrorTextByErrorType, serverErrorTexts = inputState.serverErrorTexts, isFocused = inputState.isFocused, isEdited = inputState.isEdited, timeUpdated = inputState.timeUpdated, value = inputState.value, validatorsOptions = inputState.validatorsOptions;
        var hasHadServerErrors = serverErrorTexts.length > 0;
        var canShowServerErrors = !isValidServer;
        var canShowLocalErrors = (hasBeenUnfocused && localErrorTypes.length > 0) || hasHadServerErrors;
        var canShowErrors = canShowLocalErrors || canShowServerErrors;
        var valueIsEmpty = (typeof value === "string" && value === "") || false;
        var shouldShowPlaceholder = valueIsEmpty && !isFocused;
        var inlineErrorTexts = __spreadArrays(localErrorTypes.map(function (errorType) { return localErrorTextByErrorType[errorType]; }), (canShowServerErrors ? serverErrorTexts : []));
        var latestVisibleInlineErrorTexts = useLatestDefined({
            value: inlineErrorTexts,
            isDefined: inlineErrorTexts.length > 0,
        });
        // TODO fix the as any types (T_InputId isn't working there)
        return {
            value: inputState.value,
            onChange: function (newValue) {
                return updateInput({ inputId: inputId, newValue: newValue });
            },
            onFocus: function () { return toggleFocus({ inputId: inputId, isFocused: true }); },
            onBlur: function () { return toggleFocus({ inputId: inputId, isFocused: false }); },
            isFocused: isFocused,
            isEdited: isEdited,
            isValid: isValid,
            canShowErrors: canShowErrors,
            hasVisibleErrors: canShowErrors && !isValid,
            inlineErrorTexts: inlineErrorTexts,
            latestVisibleInlineErrorTexts: latestVisibleInlineErrorTexts,
            localErrorTypes: localErrorTypes,
            localErrorTextByErrorType: localErrorTextByErrorType,
            serverErrorTexts: serverErrorTexts,
            shouldShowPlaceholder: shouldShowPlaceholder,
            validatorsOptions: validatorsOptions,
            valueIsEmpty: valueIsEmpty,
        };
    }
    return { useFormInput: useFormInput };
}
