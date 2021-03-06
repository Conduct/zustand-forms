

# zustand forms

![Example](example.gif)

- ***typesafe*** -  everything autocompleteable
- ***zustand*** - a form = plain zustand store, access and update state anywhere


featuring
- ***flexiable validation*** 
- ***server errors*** 
- ***toggling inputs*** 
- ***any platform*** - no components provided, works with regular controlled inputs
- ***low level access*** - read meta state like `timeUpdated` for custom functionality

### Getting Started

Install package
```ts
// package.json
"dependencies": { "zustand-forms": "github:Conduct/zustand-forms#v1.0.6" }
```

Define value types and validators 
```ts
import { makeValidator, makeMakeFormStore } from "zustand-forms";

const valueTypes = { text: { blankValue: "" } };
const validators = { required: makeValidator(({ value }) => !value ? "Required field" : undefined )};
const makeFormStore = makeMakeFormStore(validators, valueTypes);
```
Define a form 🗒
```ts
const useLoginForm = makeFormStore({
  firstName: { valueType: "text", defaultValidators: ["required"] },
  lastName: { valueType: "text" },
});

function LoginForm() {
  const {refreshForm, updateInput, formValues, isValid} = useLoginForm();
  useEffect(refreshForm, []); // refresh the form when it becomes visible

  return (
    <>
      <TextInput
        value={formValues.email}
        onChange={(newValue) => updateInput({inputId: 'email', newValue})}
      />
      <TextInput
        value={formValues.password}
        onChange={(newValue) => updateInput({inputId: 'password', newValue})}
      />
      <Button disabled={!isValid}>Submit</Button>
    </>
  );
}
```


*(larger examples with custom validators and more further down)*

![The same form definition used for mobile and web](nativeandweb.png)  
*native + web*

# Docs


### Refreshing forms
Refresh forms on mount to keep state like `isEdited` up-to-date.  
Here  **initial values** , **disabling validators**, and **updating server errors** can also be set

```ts
import { useSignupForm } from "forms/signupForm";
function SignupForm() {
  const refreshForm = useSignupForm((state) => state.refreshForm);
  useEffect(() => refreshForm(
	{ email: "initial@email.org"},     // set initial values for inputs
	{ password: false},                // disable validators
	{ email: ["User already exists"]}, // add server errors
	)
  , []);
  }
```

### Validator utils
For quick regex based validators,  
It includes  `email` `aNumber` `aNonNumber` `anUppercaseLetter` `aLowercaseLetter` `aSpace`  regexes,   
but more can be added/overwritten with the first parameter.
```ts
import { makeValidatorUtils, makeValidator } from "zustand-forms";
const {
  isString,
  isTypedString,
  stringMatches,
  stringDoesntMatch,
} = makeValidatorUtils({
  aCustomRegex: /\s\S/,
});
```
and can be used like this
```ts
const validatorFunctions = {
  // isTypedString
  // checks if the value is a non empty string,
  required: makeValidator(({ value }) =>
    if (!isTypedString(value)) return "Required"
  ),
  // helpful to avoid errors for empty strings in other validators
  underTenCharacters: makeValidator(({ value }) => {
    if (isTypedString(value) && value.length > 10) return "Over max" // "" wont error here, but still will for *required*
  })},
  // stringDoesntMatch
  // checks if it doesn't match a named regex
  email: makeValidator(({ value }) => {
    if (stringDoesntMatch(value, "email")) return "Please enter a valid email";
  })}
```

### Custom value types
For values with multiple properties  like `beachBall: { color: "green", size: 30 }`.
```ts
const valueTypes = {
  text: { blankValue: "" },
  rotation: { blankValue: { x: 0, y: 0, z: 0 } },
};
```


To validate custom values in a typesafe way,  
use `getTypedMakeValidator`  instead of `makeValidator`


```ts
import { getTypedMakeValidator } from "zustand-forms";

const valueTypes = {
  text: { blankValue: "" },
  rotation: {
    blankValue: { x: 0, y: 0, z: 0 },
    defaultValidators: ["allowedRotation" as "allowedRotation"] // TODO remove need for "as"
  },
};
const makeValidator = getTypedMakeValidator(valueTypes);

const validatorFunctions = {
  allowedRotation: makeValidator(({ value /* string | Rotation */ }) => {
    if (isString(value)) return;
    // now the type is guarenteed to be a Rotation { x: number, y: number, z: number }

    const isValidAngle = (angle: number) => angle > 0 && angle < 360;
    if (!isValidAngle(value.x) || !isValidAngle(value.y) || !isValidAngle(value.z))
      return "Invalid rotation";
  }),
};
```

# Form store
What's available in `getLoginForm().getState()`
### state
|    | |  
| ---------- | ------------- |
| inputStates      | { firstName: `InputState`, lastName: `InputState` }  |
| formValues  |   { firstName: "Sam", lastName: "Doe" } |
| - |  |
| allInputIds      | ["firstName", "lastName"]
|  localErrorInputIds  |  
|  serverErrorInputIds  |   |
|  checkableInputIds  |   |
|  focusedInputId  |  "firstName" |
| -|  |
| timeUpdated      |  1596601463296 |  
|  timeRefreshed  |   |  
|  timeFocused  |   |  
|  timeUnfocused  |   |  
| -|  |
| isValidLocal      |   |  
|  isValidServer  |  if there are any current server errors |  
|  isValid  |   |  
|  isEdited  |   |  
|  hasBeenUnfocused  |   |  
|  isFocused  |   |  
|  isCheckable  | if the validators should run, usually for hidden inputs  |  


### InputState
*what's inside `getLoginForm().getState().inputStates.login`*
|    |  |  
|  ---------- | ------------- |
|  inputId  | "firstName"   |
| value      | the current value  
|  initialValue  |   
|  valueType  |   | "text" |
| validatorTypes      | ["requiredLength"]  |
|  validatorsOptions  |   { requiredLength: { max: 10 } } |
| localErrorTypes  |  [“requiredLength”]   |
|  localErrorTextByErrorType  |  { requiredLength: "Must be under 11 letters" }  |
|  serverErrorTexts  | [“Name already exists”]   |  
| -|  |
| timeUpdated      |  1596601463296 |  
|  timeBecameCheckable  |   |  
|  timeBecameUncheckable  |   |  
|  timeFocused  |   |  
|  timeUnfocused  |   |  
| -|  |
| isValidLocal      |   |  
|  isValidServer  |  if there are any current server errors |  
|  isValid  |   |  
|  isEdited  |   |  
|  hasBeenUnfocused  |   |  
|  isFocused  |   |  
|  isCheckable  | if the validators should run, usually for hidden inputs  |  





### Form actions
|  |   | |  |
| - | ---------- | ------------- | - |
| | updateInput      |  `updateInput`({`inputId`, `newValue`}`) ` | use in `<input onChange />`
| | toggleFocus  |  `toggleFocus`({`inputId`, `isFocused`}`)` | use in `<input onFocus onBlur />`
| | toggleIsCheckable  |  `toggleIsCheckable(`{`inputId`, `isCheckable`}`)` | use for hidden inputs
| | refreshForm  | `refreshForm(` `initialValuesByInputId`, `isCheckableByInputId`, `serverErrorsByInputId` `)`  | use when form components mount with `useEffect(, [])`

# Advanced use
Supporting custom validators, stricter types , and simpler input definitions, but requires more boilerplate

## Validators


```ts
// Define validator functions
import { makeValidator as make, makeValidatorUtils } from "zustand-forms";

const {
  isString,
  isTypedString,
  stringMatches,
  stringDoesntMatch,
} = makeValidatorUtils({
  // custom regex, 'email' and others included by default
  anyUrl:  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  });

const validatorFunctions = {
  email: make<{}>(({ value }) => {
    if (stringDoesntMatch(value, "email")) return "Please enter a valid email";
  }),
  required: make<{ message: string }>(({ value, validatorOptions }) => {
    if (!isTypedString(value))
      return validatorOptions.message || "Required field";
  }),
  requiredLength: make<{ min?: number; max?: number }>(
    ({ value, validatorOptions: { min, max } }) => {
      if (!isTypedString(value)) return;

      if (min !== undefined && value.length < min)
        return `must be atleast ${min} characters`;

      if (max !== undefined && value.length > max)
        return {
          message: `must be less than ${max + 1} characters`,
          editedValue: value.substring(0, max), // This edits the value directly to be valid
        };
    }
  ),
  matchesOtherField: make<{ otherInputId: string; message?: string }>(
    ({ value, formState, validatorOptions: { otherInputId, message } }) => {
      const otherValue = formState.inputStates[otherInputId].value;
      const bothValuesArentEmpty = value !== "" && otherValue !== "";
      const valuesDontMatch = value !== otherValue;

      if (bothValuesArentEmpty)
        return {
          message: valuesDontMatch ? message : undefined, // if message is undefined there's no error added, but the other input still gets revalidated
          revalidateOtherInputIds: [otherInputId],
        };
    }
  ),
};

export default validatorFunctions;
```


Using in a form
```ts
import makeFormStore from "./options";

export const useSignupForm = makeFormStore({
  email: {
    valueType: "text",
    defaultValidators: ["required", "email", "requiredLength"],
    defaultValidatorsOptions: {
      requiredLength: { max: 64 },
    },
  },
  newPassword: {
    valueType: "text",
    defaultValidators: ["required", "matchesOtherField"],
    defaultValidatorsOptions: {
      required: { message: "A Password's required (custom message)" },
      matchesOtherField: {
        // message: undefined // no message returned means "confirmPassword" gets revalidated when "newPassword" updates,
        // but there won't be any error for this input
        otherInputId: "confirmPassword",
      },
    },
  },
  confirmPassword: {
    valueType: "text",
    defaultValidators: ["required", "matchesOtherField"],
    defaultValidatorsOptions: {
      matchesOtherField: {
        message: "must match passsword",
        otherInputId: "newPassword",
      },
    },
  },
});
```

## Folder structure

- 📂src
  - 📂forms
  - 📄 loginForm.ts
  - 📄 signupForm.ts
  - 📄 index.ts
    - 📂options
    - 📄 valueTypes.ts
    - 📄 validatorFunctions
    - 📄 index.ts (creates `makeFormStore`)
   - 📂components
     - 📄FormInput.tsx
   - 📄App.tsx


 ## Validator params helper types
Currently not built in, these types can be used to get the custom validators param types for each validator, 

e.g  `{ min: number, max: number }` for "requiredLength", 
or `{message: string}` for "required"

 ```ts
 type ValidatorFunctions = typeof validatorFunctions;
 export type ValidatorType = keyof ValidatorFunctions;

 type NoValidatorOptions = {validatorOptions: never};
 type HasValidatorOptions = {validatorOptions?: any} | {validatorOptions: any};
 type CheckValidatorOptions<
   TheParameters extends any
 > = TheParameters extends HasValidatorOptions
   ? TheParameters
   : NoValidatorOptions;

 type CustomValidatorParams<
   T_ValidatorType extends ValidatorType
 > = CheckValidatorOptions<
   Parameters<ValidatorFunctions[T_ValidatorType]>[0] // gets the first param object ({value, formState, validatorOptions etc})
 >['validatorOptions'];

 export type ValidatorOptionsByValidatorType = {
   [P_ValidatorType in ValidatorType]: CustomValidatorParams<P_ValidatorType>;
 };

 // Can be useful for custom functionality based on inputState.validatorsOptions
 export type ValidatorsOptions = Partial<ValidatorOptionsByValidatorType>;
 ```

## Generic FormInput
*a generic FormInput component that supports any form*

```ts
import { makeValidator, makeMakeFormStore, InputIdFromFormStore, makeFormHooks } from "zustand-forms";

// Define value types
const valueTypes = {
  text: { blankValue: "" },
  number: { blankValue: 0 },
  boolean: { blankValue: false },
};
// Define validators
const validatorFunctions = {
  required: makeValidator(({ value }) =>
    !value ? "Required field" : undefined
  ),
};

// Define some forms 🗒
const makeFormStore = makeMakeFormStore(validatorFunctions, valueTypes);

export const useLoginForm = makeFormStore({
  firstName: { valueType: "text", defaultValidators: ["required"] },
  lastName: { valueType: "text" },
});

export const useSignupForm = makeFormStore({
  email: { valueType: "text", defaultValidators: ["required"] },
  password: { valueType: "text", defaultValidators: ["required"] },
});
// These form hooks can be used as-is, or a combined hook can be made below

// Add all form stores keyed by form name
const formStores = { login: useLoginForm, signup: useSignupForm };

// Get forms hook
export const { useFormInput } = makeFormHooks(formStores);

// Get forms types
type FormStoresHelperTypes = MakeFormStoresHelperTypes<typeof formStores>;
export type FormName = FormStoresHelperTypes["FormName"]; // "login" | "signup"
export type InputIdByFormName = FormStoresHelperTypes["InputIdByFormName"]; // InputIdByFormName["login"] -> "email" | "password"
```
using with components
```ts
type Props<T_FormName, T_InputId> = {
  inputId: T_InputId;
  formName: T_FormName;
  title: string;
};

const FormInput = <
  T_FormName extends FormName,
  T_InputId extends InputIdByFormName[T_FormName]
>({ formName,inputId,title}: Props<T_FormName, T_InputId>) => {

  const {
    onChange, value, onFocus, onBlur, inlineErrorTexts, canShowErrors
  } = useFormInput({ inputId, formName });

  return (
    <div>
      <div>{title}</div>
      <input
        {...{ onFocus, onBlur, value }}
        onChange={(e) => onChange(e.target.value)}
      />
      {canShowErrors && <div>{inlineErrorTexts.join(", ")}</div>}
    </div>
  );
};

const SignupForm = () => {
  const refreshForm = useSignupForm((state) => state.refreshForm);
  const isValid = useSignupForm((state) => state.isValid);
  useEffect(refreshForm, []); // refresh the form when it becomes visible
  return (
    <>
      <FormInput formName="signup" inputId="email" />
      <FormInput formName="signup" inputId="password" />
      <button
        onClick={()=> anApi.signup(useSignupForm.getState().formValues)}
        disabled={!isValid}
      >
        submit
      </button>
    </>
  );
};
```


# Library development
For a quick way to edit this package, add `📂src` to your project as a renamed local folder like `📂zustand-forms-dev`, and replace imports from `"zustand-forms"` to `"zustand-forms-dev"`.  
( Enabling `"baseUrl":` in `tsconfig.json` allows non-relative imports  )

After making changes, update the files in this libraries src folder, update the version number in package.json, remove node_modules and lib folders, and run `npm install`.  

Then the library can be pushed , ideally with a new tag with the version number added.
