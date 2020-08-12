export default function useLatestDefined<T_Value extends any>({ value, isDefined, }: {
    value: T_Value;
    isDefined?: boolean;
}): T_Value;
