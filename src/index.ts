import { StoreApi } from "zustand";

export { default as makeMakeFormStore } from "./makeFormStore";
export {
  makeValidatorFunction as makeValidator,
  makeValidatorUtils,
  getTypedMakeValidator,
} from "./makeFormStore/validatorFunctionUtils";
export { makeFormHooks } from "./makeFormHooks";

// @ts-ignore: expects "export type {..."  but that only works in the module, not if this is in a local folder
export { MakeFormStoresHelperTypes } from "./utils/typeHelpers";

export type InputIdFromFormApi<
  T_FormApi extends StoreApi<any>
> = keyof ReturnType<T_FormApi["getState"]>["inputStates"];

// export type {
//   InputValue,
//   InputValueFromOptions,
//   MakeInputsOptions,
// } from "./makeFormStore/types";
