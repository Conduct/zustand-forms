// only a partial InputState object for properties with basic types
export const defaultInputState = {
  localErrorTypes: [] as string[],
  localErrorTextByErrorType: {} as Record<string, string>,
  serverErrorTexts: [] as string[],
  // times
  timeUpdated: 0,
  timeBecameCheckable: 0, // whenever the input becomes visible
  timeBecameUncheckable: 0, // whenever the input becomes hidden
  timeFocused: 0,
  timeUnfocused: 0,
  // booleans
  isValid: true,
  isEdited: false,
  hasBeenUnfocused: false,
  isFocused: false,
  isCheckable: true,
};
