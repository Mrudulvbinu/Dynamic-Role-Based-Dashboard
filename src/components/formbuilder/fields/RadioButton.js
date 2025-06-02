import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const RadioButton = ({ field, control: propControl }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control) return null;

  return (
    <FormControl component="fieldset" margin="normal">
      <FormLabel component="legend">{field.label}</FormLabel>
      <Controller
        name={field.id}
        control={control}
        render={({ field: { onChange, value } }) => (
          <RadioGroup value={value || ""} onChange={onChange}>
            {field.options.map((opt, index) => (
              <FormControlLabel
                key={index}
                value={opt}
                control={<Radio />}
                label={opt}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default RadioButton;
