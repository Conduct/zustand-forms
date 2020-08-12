import { useRef, useEffect } from "react";

// for keeping track of a previous value if the new value is undefined
// e.g for fading out the latest error texts when there's no more errors
export default function useLatestDefined<T_Value extends any>({
  value,
  isDefined = true,
}: {
  value: T_Value;
  isDefined?: boolean;
}) {
  const ref = useRef(value); // could start as undefined too
  useEffect(() => {
    if (isDefined) {
      ref.current = value;
    }
  }, [isDefined, value]);
  return isDefined ? value : ref.current;
}
