var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import create from "zustand";
import produce from "immer";
import { defaultInputState } from "./consts";
import { objectAssign } from "./utils";
export default function makeMakeFormStore(validatorFunctions, valueTypes) {
    function makeFormStore(makeInputsOptions) {
        // ------------------------------------------
        //  Internal utils (using internal types)
        // ------------------------------------------
        function getDraftInputState(draftState, inputId) {
            return draftState.inputStates[inputId];
        }
        function getCheckableInputIds(draftState) {
            return draftState.allInputIds.filter(function (loopedInputId) { return draftState.inputStates[loopedInputId].isCheckable; });
        }
        function getLocalInvalidInputIds(draftState) {
            return draftState.allInputIds.filter(function (loopedInputId) {
                var inputState = draftState.inputStates[loopedInputId];
                return !inputState.isValidLocal && inputState.isCheckable;
            });
        }
        function getServerInvalidInputIds(draftState) {
            return draftState.allInputIds.filter(function (loopedInputId) {
                var inputState = draftState.inputStates[loopedInputId];
                return !inputState.isValidServer && inputState.isCheckable;
            });
        }
        function getIsFormEdited(draftState) {
            return draftState.allInputIds.some(function (inputId) { return draftState.inputStates[inputId].isEdited; });
        }
        function getIsInputEdited(_a) {
            var inputId = _a.inputId, draftState = _a.draftState;
            var inputState = draftState.inputStates[inputId];
            return inputState.value !== inputState.initialValue;
        }
        // updates draftState directly
        function updateDraftFormValidationState(draftState) {
            var localInvalidInputIds = getLocalInvalidInputIds(draftState);
            draftState.localErrorInputIds = localInvalidInputIds;
            draftState.isValidLocal = localInvalidInputIds.length === 0;
            var serverInvalidInputIds = getServerInvalidInputIds(draftState);
            draftState.serverErrorInputIds = serverInvalidInputIds;
            draftState.isValidServer = serverInvalidInputIds.length === 0;
            draftState.isValid = draftState.isValidLocal && draftState.isValidServer;
        }
        function getLocalValidationInfoForInput(_a) {
            var _b;
            var inputId = _a.inputId, draftState = _a.draftState, _c = _a.validationInfoByInputId, validationInfoByInputId = _c === void 0 ? {} : _c, originalInputId = _a.originalInputId;
            var inputState = getDraftInputState(draftState, inputId);
            if (!inputState.isCheckable)
                return validationInfoByInputId;
            if (!validationInfoByInputId[inputId]) {
                validationInfoByInputId[inputId] = {
                    errorTypes: [],
                    errorTextsByErrorType: {},
                    editedValue: undefined,
                };
            }
            var inputValidationInfo = validationInfoByInputId[inputId];
            var valueToCheck = (_b = inputValidationInfo.editedValue) !== null && _b !== void 0 ? _b : inputState.value;
            for (var _i = 0, _d = inputState.validatorTypes; _i < _d.length; _i++) {
                var validatorType = _d[_i];
                var errorResult = validatorFunctions[validatorType]({
                    inputId: inputId,
                    formState: draftState,
                    inputState: inputState,
                    value: valueToCheck,
                    // NOTE: using any to remove internal typescript warning, still typed externally
                    validatorOptions: (inputState.validatorsOptions[validatorType] ||
                        {}),
                });
                if (errorResult) {
                    if (typeof errorResult === "string") {
                        inputValidationInfo.errorTypes.push(validatorType);
                        inputValidationInfo.errorTextsByErrorType[validatorType] = errorResult;
                    }
                    else {
                        // check if there's any edit values
                        if (errorResult.editedValue !== undefined) {
                            inputValidationInfo.editedValue = errorResult.editedValue;
                            // NOTE: may cause an infinite loop?
                            if (errorResult.editedValue !== valueToCheck) {
                                // revalidate if the input was edited
                                getLocalValidationInfoForInput({
                                    inputId: inputId,
                                    draftState: draftState,
                                    validationInfoByInputId: validationInfoByInputId,
                                });
                            }
                        }
                        // only continue with validating if the value wasn't just edited
                        // (the edited value sill gets validated inside getLocalValidationInfoForInput() above)
                        // This step prevents an error showing for a value that was already fixed with editedValue
                        // e.g "abcd" (error must be under 4 letters) -> editedValue :"abc" (no error)
                        var hasAnEditedValue = inputValidationInfo.editedValue !== undefined;
                        var editedValueWasJustChanged = errorResult.editedValue !== valueToCheck;
                        var canContinueValidatingInput = !hasAnEditedValue || !editedValueWasJustChanged;
                        if (canContinueValidatingInput) {
                            if (errorResult.message) {
                                inputValidationInfo.errorTypes.push(validatorType);
                                inputValidationInfo.errorTextsByErrorType[validatorType] = errorResult.message;
                            }
                            if (errorResult.revalidateOtherInputIds) {
                                errorResult.revalidateOtherInputIds.forEach(function (loopedInputId) {
                                    if (loopedInputId !== originalInputId) {
                                        getLocalValidationInfoForInput({
                                            inputId: loopedInputId,
                                            originalInputId: originalInputId
                                                ? originalInputId
                                                : inputId,
                                            draftState: draftState,
                                            validationInfoByInputId: validationInfoByInputId,
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
        function revalidateInputInPlace(_a) {
            var inputId = _a.inputId, draftState = _a.draftState;
            var currentTime = Date.now();
            var draftInputState = getDraftInputState(draftState, inputId);
            var validationInfoByInputId = getLocalValidationInfoForInput({
                inputId: inputId,
                draftState: draftState,
            });
            var updatedInputIds = Object.keys(validationInfoByInputId);
            updatedInputIds.forEach(function (loopedInputId) {
                var loopedDraftInputState = getDraftInputState(draftState, loopedInputId);
                var loopedValidationInfo = validationInfoByInputId[loopedInputId];
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
                        draftState: draftState,
                    });
                }
                // update validation values
                objectAssign(loopedDraftInputState, {
                    localErrorTypes: loopedValidationInfo.errorTypes,
                    localErrorTextByErrorType: loopedValidationInfo.errorTextsByErrorType,
                    isValidLocal: loopedValidationInfo.errorTypes.length === 0,
                    isValidServer: loopedDraftInputState.serverErrorTexts.length === 0 ||
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
        var inputIds = Object.keys(makeInputsOptions);
        var initialInputStates = inputIds.reduce(function (editedObject, inputId) {
            var _a;
            var _b, _c, _d, _e;
            var inputOptions = makeInputsOptions[inputId];
            var valueType = inputOptions.valueType;
            var initialValue = inputOptions.defaultInitialValue || valueTypes[valueType].blankValue;
            var validatorTypes = __spreadArrays(((_b = valueTypes[valueType].defaultValidators) !== null && _b !== void 0 ? _b : []), ((_c = inputOptions.defaultValidators) !== null && _c !== void 0 ? _c : []));
            var validatorsOptions = __assign(__assign({}, ((_d = valueTypes[valueType].defaultValidatorsOptions) !== null && _d !== void 0 ? _d : {})), ((_e = inputOptions.defaultValidatorsOptions) !== null && _e !== void 0 ? _e : {}));
            return __assign(__assign({}, editedObject), (_a = {}, _a[inputId] = __assign(__assign({}, defaultInputState), { inputId: inputId,
                valueType: valueType, value: initialValue, initialValue: initialValue,
                validatorTypes: validatorTypes,
                validatorsOptions: validatorsOptions }), _a));
        }, {});
        var initialFormValues = inputIds.reduce(function (editedObject, inputId) {
            var _a;
            var inputOptions = makeInputsOptions[inputId];
            var valueType = inputOptions.valueType;
            var initialValue = inputOptions.defaultInitialValue || valueTypes[valueType].blankValue;
            return __assign(__assign({}, editedObject), (_a = {}, _a[inputId] = initialValue, _a));
        }, {});
        return create(function (set, get) {
            // (not in utils becuase it needs access to "set()")
            function _setImmutable(editDraftState) {
                // NOTE make sure to use outside of loops (not inside) so it only runs "set" once
                // NOTE: this can also work as (editDraftStateFunction) => set(produce(editDraftStateFunction))
                //       but using the longer version to be more understandable
                set(function (baseState) {
                    var nextState = produce(baseState, function (draftState) {
                        // NOTE when using the draftState default type, this error occurs
                        // "Expression produces a union type that is too complex to represent" so retyping it here
                        var retypedDraftState = draftState;
                        editDraftState(retypedDraftState);
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
                updateInput: function (_a) {
                    var inputId = _a.inputId, newValue = _a.newValue;
                    _setImmutable(function (draftState) {
                        var draftInputState = getDraftInputState(draftState, inputId);
                        var currentTime = Date.now();
                        // update the inputs value
                        draftInputState.value = newValue;
                        draftInputState.timeUpdated = currentTime;
                        draftState.formValues[inputId] = newValue;
                        draftState.timeUpdated = currentTime;
                        // check if the input was edited from the original value
                        draftInputState.isEdited = getIsInputEdited({
                            inputId: inputId,
                            draftState: draftState,
                        });
                        revalidateInputInPlace({ draftState: draftState, inputId: inputId });
                        draftState.isEdited = getIsFormEdited(draftState);
                        updateDraftFormValidationState(draftState);
                    });
                },
                toggleFocus: function (_a) {
                    var inputId = _a.inputId, newIsFocused = _a.isFocused;
                    var currentTime = Date.now();
                    _setImmutable(function (draftState) {
                        var draftInputState = getDraftInputState(draftState, inputId);
                        draftInputState.isFocused = newIsFocused;
                        if (newIsFocused) {
                            draftInputState.timeFocused = currentTime;
                            objectAssign(draftState, {
                                focusedInputId: inputId,
                                isFocused: true,
                                timeFocused: currentTime,
                            });
                        }
                        else {
                            objectAssign(draftInputState, {
                                hasBeenUnfocused: true,
                                timeUnfocused: currentTime,
                            });
                        }
                    });
                    // set the form as unfocused if no new inputs have been focused after this unfocused
                    if (!newIsFocused) {
                        setTimeout(function () {
                            if (get().focusedInputId === inputId) {
                                _setImmutable(function (draftState) {
                                    objectAssign(draftState, {
                                        focusedInputId: "",
                                        isFocused: false,
                                        timeUnfocused: currentTime,
                                        hasBeenUnfocused: true,
                                    });
                                });
                            }
                        }, 50); // NOTE if there's issues with inputs not focusing quick enough, this can be increased
                    }
                },
                toggleIsCheckable: function (_a) {
                    var inputId = _a.inputId, newIsCheckable = _a.isCheckable;
                    var baseState = get();
                    var inputStates = baseState.inputStates;
                    var baseInputState = inputStates[inputId];
                    var currentTime = Date.now();
                    _setImmutable(function (draftState) {
                        var draftInputState = getDraftInputState(draftState, inputId);
                        draftInputState.isCheckable = newIsCheckable;
                        revalidateInputInPlace({ draftState: draftState, inputId: inputId });
                        if (newIsCheckable !== baseInputState.isCheckable) {
                            var checkableInputIds = getCheckableInputIds(draftState);
                            objectAssign(draftState, {
                                checkableInputIds: checkableInputIds,
                                isCheckable: checkableInputIds.length > 0,
                            });
                            if (newIsCheckable) {
                                draftInputState.timeBecameCheckable = currentTime;
                            }
                            else {
                                draftInputState.timeBecameUncheckable = currentTime;
                            }
                        }
                        updateDraftFormValidationState(draftState);
                    });
                },
                refreshForm: function (initialValuesByInputId, isCheckabByInputId, serverErrorsByInputId) {
                    // make sure to validate each input while setting the inital values
                    // initialValuesByInputId
                    var baseState = get();
                    var inputStates = baseState.inputStates;
                    var currentTime = Date.now();
                    _setImmutable(function (draftState) {
                        var _a, _b, _c, _d, _e;
                        for (var _i = 0, _f = baseState.allInputIds; _i < _f.length; _i++) {
                            var inputId = _f[_i];
                            var draftInputState = getDraftInputState(draftState, inputId);
                            var baseInputState = inputStates[inputId];
                            var newInitialValue = ((_b = (_a = initialValuesByInputId === null || initialValuesByInputId === void 0 ? void 0 : initialValuesByInputId[inputId]) !== null && _a !== void 0 ? _a : makeInputsOptions[inputId].defaultInitialValue) !== null && _b !== void 0 ? _b : valueTypes[baseInputState.valueType]
                                .blankValue);
                            var newServerErrors = (_c = serverErrorsByInputId === null || serverErrorsByInputId === void 0 ? void 0 : serverErrorsByInputId[inputId]) !== null && _c !== void 0 ? _c : [];
                            var newIsCheckable = (_e = (_d = isCheckabByInputId === null || isCheckabByInputId === void 0 ? void 0 : isCheckabByInputId[inputId]) !== null && _d !== void 0 ? _d : makeInputsOptions[inputId].defaultIsCheckable) !== null && _e !== void 0 ? _e : true;
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
                            revalidateInputInPlace({ draftState: draftState, inputId: inputId });
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
