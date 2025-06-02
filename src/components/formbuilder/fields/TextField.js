import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField as MuiTextField } from "@mui/material";
import PropTypes from "prop-types";

const TextField = ({ field, control: propControl, isPreview = false }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  if (!control || isPreview) {
    // Read-only preview mode
    return (
      <MuiTextField
        fullWidth
        label={field.label || "Text Field"}
        value={field.defaultValue || ""}
        disabled
        margin="normal"
        variant="outlined"
        sx={{ mb: 2 }}
        placeholder={field.placeholder}
      />
    );
  }

  // Controlled form field with react-hook-form
  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue={field.defaultValue || ""}
      rules={{
        required: field.required ? "This field is required" : false,
        ...field.validationRules,
      }}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
        <MuiTextField
          fullWidth
          inputRef={ref}
          label={field.label}
          value={value}
          onChange={onChange}
          required={field.required}
          margin="normal"
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          sx={{ mb: 2 }}
          placeholder={field.placeholder}
          type={field.type || "text"}
          multiline={field.multiline}
          rows={field.rows}
          InputProps={{
            readOnly: field.readOnly,
          }}
        />
      )}
    />
  );
};

TextField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    required: PropTypes.bool,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    readOnly: PropTypes.bool,
    validationRules: PropTypes.object,
  }).isRequired,
  control: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default TextField;
