// // A typed version of Object.assign, expecting the new object to have properties from the current object
export function objectAssign<T_ObjectType>(
  theObject: T_ObjectType,
  newProperties: Partial<T_ObjectType>
) {
  return Object.assign(theObject, newProperties);
}
