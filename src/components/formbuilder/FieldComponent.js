import React from "react";
import TextField from "./fields/TextField";
import DropdownField from "./fields/DropdownField";
import CheckboxField from "./fields/CheckboxField";
import DateField from "./fields/DateField";
import RadioButton from "./fields/RadioButton";

const fieldMap = {
  textfield: TextField,
  dropdown: DropdownField,
  checkbox: CheckboxField,
  date: DateField,
  radio: RadioButton,
};

const FieldComponent = ({ field, control }) => {
  const Component = fieldMap[field.type];
  if (!Component) return null;
  return <Component field={field} control={control} />;
};

export default FieldComponent;
