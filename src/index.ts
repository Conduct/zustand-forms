import { UseStore } from "zustand";

export { default as makeMakeFormStore } from "./makeFormStore";
export {
  makeValidatorFunction as makeValidator,
  makeValidatorUtils,
  getTypedMakeValidator,
} from "./makeFormStore/validatorFunctionUtils";
export { makeFormHooks } from "./makeFormHooks";

// @ts-ignore: expects "export type {..."  but that only works in the module, not if this is in a local folder
export { MakeFormStoresHelperTypes } from "./utils/typeHelpers";

export type InputIdFromFormStore<
  T_FormApi extends UseStore<any>
> = keyof ReturnType<T_FormApi["getState"]>["inputStates"];

// export type {
//   InputValue,
//   InputValueFromOptions,
//   MakeInputsOptions,
// } from "./makeFormStore/types";
