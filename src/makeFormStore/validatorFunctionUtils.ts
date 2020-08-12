import {
  InputValue,
  ValidatorParams,
  ValidatorReturn,
  AnyKey,
  UntypedValueTypes,
} from "./types";

export function getTypedMakeValidator<
  T_ValidatorType extends AnyKey,
  T_ValueTypes extends UntypedValueTypes<T_ValidatorType>
>(valueTypes: T_ValueTypes) {
  function makeValidatorFunction<T_CustomOptions extends Record<any, any>>(
    validatorFunction: (
      options: ValidatorParams<T_ValueTypes> & {
        validatorOptions: T_CustomOptions;
      }
    ) => ValidatorReturn
  ) {
    return validatorFunction;
  }

  return makeValidatorFunction;
}

export function makeValidatorFunction<T_CustomOptions extends Record<any, any>>(
  validatorFunction: (
    options: ValidatorParams<any> & {
      validatorOptions: T_CustomOptions;
    }
  ) => ValidatorReturn
) {
  return validatorFunction;
}

const defaultRegexes = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  aNumber: /[0-9]/,
  aNonNumber: /[^0-9]/,
  anUppercaseLetter: /[A-Z]/,
  aLowercaseLetter: /[a-z]/,
  aSpace: /\s/,
};

export function makeValidatorUtils<
  T_CustomRegexesByName extends Record<string, RegExp>
>(customRegexes?: T_CustomRegexesByName) {
  type RegexName = T_CustomRegexesByName extends Record<string, RegExp>
    ? keyof T_CustomRegexesByName | keyof typeof defaultRegexes
    : keyof typeof defaultRegexes;

  const regexes: Record<RegexName, RegExp> = {
    ...defaultRegexes,
    ...(customRegexes ?? ({} as Record<RegexName, RegExp>)),
  };

  function isString(value: InputValue<any, any, any>): value is string {
    return typeof value === "string";
  }
  function isTypedString(value: InputValue<any, any, any>): value is string {
    // is a string and not empty
    return !isString(value) || !(isString(value) && value.length === 0);
  }
  function stringMatches(
    value: InputValue<any, any, any>,
    regexName: RegexName
  ): value is string {
    return isTypedString(value) && regexes[regexName].test(value);
  }
  function stringDoesntMatch(
    value: InputValue<any, any, any>,
    regexName: RegexName
  ): value is string {
    return isTypedString(value) && !regexes[regexName].test(value);
  }

  return {
    isString,
    isTypedString,
    stringMatches,
    stringDoesntMatch,
  };
}
