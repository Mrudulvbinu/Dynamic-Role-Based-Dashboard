import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControlLabel, Checkbox } from "@mui/material";

const CheckboxField = ({ field, control: propControl }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control) return null; // Prevent crash

  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              required={field.required}
            />
          }
          label={field.label}
        />
      )}
    />
  );
};

export default CheckboxField;
