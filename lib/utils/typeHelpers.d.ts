import { UseStore } from "zustand";
declare type UntypedFormStores = Record<string, UseStore<any>>;
export declare type MakeFormStoresHelperTypes<T_FormStores extends UntypedFormStores> = {
    FormName: keyof T_FormStores;
    InputIdByFormName: {
        [P_FormName in keyof T_FormStores]: InputIdsFromFormName<T_FormStores, P_FormName>;
    };
};
export declare type InputIdsFromFormName<FormStores extends UntypedFormStores, T_FormName extends keyof FormStores> = keyof ReturnType<FormStores[T_FormName]["getState"]>["inputStates"];
export {};
