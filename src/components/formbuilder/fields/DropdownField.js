import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const DropdownField = ({ field, control: propControl }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control) return null;

  return (
    <FormControl fullWidth margin="dense" required={field.required}>
      <InputLabel>{field.label}</InputLabel>
      <Controller
        name={field.id}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select value={value || ""} onChange={onChange}>
            {field.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default DropdownField;
