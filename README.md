
# zustand forms
*fast typesafe form states as zustand stores*

![Example](example.gif)

### Why zustand-forms?
- *typesafe*, avoids typos and mismatching form names/inputIds + autocomplete convenience
- *separated state*, not tied to views or react components, accessible from any function
- *flexible validation*, supporting custom parameters and checking other form state
- *serverside errors*, all form state is in one place
- *platform independant*, the same form definitions can be used for native and web


### Getting Started

```ts
// package.json
"dependencies": { "zustand-forms": "github:Conduct/zustand-forms" }
```

```ts
import { makeValidator, makeMakeFormStore, InputIdFromFormStore } from "zustand-forms";

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
export type InputIdByFormName = FormStoresHelperTypes["InputIdByFormName"]; /

```
*Then use with components*
```tsx

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

*(larger complete example with custom validators and more further down)*

![The same form definition used for mobile and web](nativeandweb.png)  
*The same form definition can be used for native and web*

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
```
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

# States

### Input state
|  |   | ℹ️ |  
| - | ---------- | ------------- |
| | inputId  | "firstName"   |
|***values***  | value      | the current value  
| | initialValue  |   
| | valueType  |   | "text" |
|***validators***  | validatorTypes      | ["requiredLength"]  |
| | validatorsOptions  |   { requiredLength: { max: 10 } } |
|***current errors***  | localErrorTypes  |  [“requiredLength”]   |
| | localErrorTextByErrorType  |  { requiredLength: "Must be under 11 letters" }  |
| | serverErrorTexts  | [“Name already exists”]   |  
|***times***  | timeUpdated      |  1596601463296 |  
| | timeBecameCheckable  |   |  
| | timeBecameUncheckable  |   |  
| | timeFocused  |   |  
| | timeUnfocused  |   |  
|***booleans***  | isValidLocal      |   |  
| | isValidServer  |  if there are any current server errors |  
| | isValid  |   |  
| | isEdited  |   |  
| | hasBeenUnfocused  |   |  
| | isFocused  |   |  
| | isCheckable  | if the validators should run, usually for hidden inputs  |  


### Form state
|  |   | |  
| - | ---------- | ------------- |
|***inputIds***  | allInputIds      | ["firstName", "lastName"]
| | localErrorInputIds  |  
| | serverErrorInputIds  |   |
| | checkableInputIds  |   |
| | focusedInputId  |  "firstName" |
|***input states***  | inputStates      | { firstName: `InputState` }  |
| | formValues  |   { firstName: "Sam" } |
|***times***  | timeUpdated      |  1596601463296 |  
| | timeRefreshed  |   |  
| | timeFocused  |   |  
| | timeUnfocused  |   |  
|***booleans***  | isValidLocal      |   |  
| | isValidServer  |  if there are any current server errors |  
| | isValid  |   |  
| | isEdited  |   |  
| | hasBeenUnfocused  |   |  
| | isFocused  |   |  
| | isCheckable  | if the validators should run, usually for hidden inputs  |  


### Form actions
|  |   | |  |
| - | ---------- | ------------- | - |
| | updateInput      |  `updateInput`({`inputId`, `newValue`}`) ` | use in `<input onChange />`
| | toggleFocus  |  `toggleFocus`({`inputId`, `isFocused`}`)` | use in `<input onFocus onBlur />`
| | toggleIsCheckable  |  `toggleIsCheckable(`{`inputId`, `isCheckable`}`)` | use for hidden inputs
| | refreshForm  | `refreshForm(` `initialValuesByInputId`, `isCheckableByInputId`, `serverErrorsByInputId` `)`  | use when form components mount with `useEffect(, [])`


## Example validators


```js
// Define validator functions
import { makeValidator as make, makeValidatorUtils } from "zustand-forms";

const {
  isString,
  isTypedString,
  stringMatches,
  stringDoesntMatch,
} = makeValidatorUtils({
  aCustomRegex: /\s\S/,
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
          editedValue: value.substring(0, max),
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
          message: valuesDontMatch ? message : undefined,
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

## Example folder structure

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






## Development
For a quick way to edit this package, add `📂src` to your project as a renamed local folder like `📂zustand-forms-dev`, and replacing imports from `"zustand-forms"` to `"zustand-forms-dev"`.  
Enabling `"baseUrl":` in `tsconfig.json` allows non-relative imports
