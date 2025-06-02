import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const DateField = ({ field, control: propControl, isPreview = false }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control || isPreview) {
    return (
      <TextField
        type="date"
        fullWidth
        label={field.label}
        value={field.defaultValue || ""}
        disabled
        margin="normal"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
    );
  }

  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue={field.defaultValue || ""}
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
          sx={{ mb: 2 }}
        />
      )}
    />
  );
};

DateField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    defaultValue: PropTypes.string,
    required: PropTypes.bool,
  }).isRequired,
  control: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default DateField;
