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
export function getTypedMakeValidator(valueTypes) {
    function makeValidatorFunction(validatorFunction) {
        return validatorFunction;
    }
    return makeValidatorFunction;
}
export function makeValidatorFunction(validatorFunction) {
    return validatorFunction;
}
var defaultRegexes = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    aNumber: /[0-9]/,
    aNonNumber: /[^0-9]/,
    anUppercaseLetter: /[A-Z]/,
    aLowercaseLetter: /[a-z]/,
    aSpace: /\s/,
};
export function makeValidatorUtils(customRegexes) {
    var regexes = __assign(__assign({}, defaultRegexes), (customRegexes !== null && customRegexes !== void 0 ? customRegexes : {}));
    function isString(value) {
        return typeof value === "string";
    }
    function isTypedString(value) {
        // is a string and not empty
        return !isString(value) || !(isString(value) && value.length === 0);
    }
    function stringMatches(value, regexName) {
        return isTypedString(value) && regexes[regexName].test(value);
    }
    function stringDoesntMatch(value, regexName) {
        return isTypedString(value) && !regexes[regexName].test(value);
    }
    return {
        isString: isString,
        isTypedString: isTypedString,
        stringMatches: stringMatches,
        stringDoesntMatch: stringDoesntMatch,
    };
}
