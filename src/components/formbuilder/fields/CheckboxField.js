import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";
import PropTypes from "prop-types";

const CheckboxField = ({ field, control: propControl, isPreview = false }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control || isPreview) {
    return (
      <FormControlLabel
        control={<Checkbox checked={field.defaultValue || false} disabled />}
        label={<Typography sx={{ fontWeight: 500 }}>{field.label}</Typography>}
        sx={{ mb: 2 }}
      />
    );
  }

  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue={field.defaultValue || false}
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
          sx={{ mb: 2 }}
        />
      )}
    />
  );
};

CheckboxField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool,
    required: PropTypes.bool,
  }).isRequired,
  control: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default CheckboxField;
