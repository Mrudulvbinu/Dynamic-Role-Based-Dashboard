import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";

const DateField = ({ field, control: propControl }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control) return null;

  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => (
        <TextField
          type="date"
          fullWidth
          label={field.label}
          value={value || ""}
          onChange={onChange}
          required={field.required}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
      )}
    />
  );
};

export default DateField;
