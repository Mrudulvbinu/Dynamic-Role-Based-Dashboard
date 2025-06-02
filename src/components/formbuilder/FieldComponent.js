import React from "react";
import TextField from "./fields/TextField";
import DropdownField from "./fields/DropdownField";
import CheckboxField from "./fields/CheckboxField";
import DateField from "./fields/DateField";
import RadioButton from "./fields/RadioButton";
import Label from "./fields/Label";

const fieldMap = {
  textfield: TextField,
  dropdown: DropdownField,
  checkbox: CheckboxField,
  date: DateField,
  radio: RadioButton,
  label: Label,
};

const FieldComponent = ({ field, control }) => {
  const Component = fieldMap[field.type];
  if (!Component) return null;
  return <Component field={field} control={control} />;
};

export default FieldComponent;
