import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import PropTypes from "prop-types";

const RadioButton = ({ field, control: propControl, isPreview = false }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  // When in preview mode, render disabled UI
  if (isPreview || !control) {
    return (
      <FormControl component="fieldset" margin="normal" fullWidth>
        <FormLabel component="legend" sx={{ mb: 1 }}>
          {field.label || "Radio Group"}
        </FormLabel>
        <RadioGroup row defaultValue={field.options?.[0]}>
          {field.options?.map((opt, idx) => (
            <FormControlLabel
              key={idx}
              value={opt}
              control={<Radio disabled />}
              label={opt}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  }

  // When in edit mode (form input)
  return (
    <FormControl component="fieldset" margin="normal" fullWidth>
      <FormLabel component="legend" sx={{ mb: 1 }}>
        {field.label || "Radio Group"}
      </FormLabel>
      <Controller
        name={field.id}
        control={control}
        defaultValue={field.options?.[0] || ""}
        rules={{
          required: field.required ? "This field is required" : false,
        }}
        render={({ field: { onChange, value } }) => (
          <RadioGroup row value={value || ""} onChange={onChange}>
            {field.options?.map((opt, idx) => (
              <FormControlLabel
                key={idx}
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

RadioButton.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  control: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default RadioButton;
