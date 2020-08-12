// only a partial InputState object for properties with basic types
export var defaultInputState = {
    localErrorTypes: [],
    localErrorTextByErrorType: {},
    serverErrorTexts: [],
    // times
    timeUpdated: 0,
    timeBecameCheckable: 0,
    timeBecameUncheckable: 0,
    timeFocused: 0,
    timeUnfocused: 0,
    // booleans
    isValid: true,
    isEdited: false,
    hasBeenUnfocused: false,
    isFocused: false,
    isCheckable: true,
};
