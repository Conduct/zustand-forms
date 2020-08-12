import { useRef, useEffect } from "react";
// for keeping track of a previous value if the new value is undefined
// e.g for fading out the latest error texts when there's no more errors
export default function useLatestDefined(_a) {
    var value = _a.value, _b = _a.isDefined, isDefined = _b === void 0 ? true : _b;
    var ref = useRef(value); // could start as undefined too
    useEffect(function () {
        if (isDefined) {
            ref.current = value;
        }
    }, [isDefined, value]);
    return isDefined ? value : ref.current;
}
