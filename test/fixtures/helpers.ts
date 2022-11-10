export function areFieldsValid(fields: any, targetFields: string[]): boolean {
  if(!fields) { return false; }
  let fieldsValid = true;
  
  targetFields.forEach((field) => {
    if(!Object.keys(fields).includes(field)) {
      fieldsValid = false;
    }
  });
  
  Object.keys(fields).forEach((field) => {
    if(!targetFields.includes(field)) {
      fieldsValid = false;
    }
  });
  
  return fieldsValid;
}
