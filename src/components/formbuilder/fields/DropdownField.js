import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const DropdownField = ({ field, control: propControl, isPreview = false }) => {
  const context = useFormContext();
  const control = propControl || context?.control;

  const commonProps = {
    fullWidth: true,
    label: field.label,
    required: field.required,
    margin: "normal",
    select: true,
    sx: { mb: 2 },
  };

  if (!control || isPreview) {
    return (
      <TextField {...commonProps} value={field.defaultValue || ""} disabled>
        {field.options?.map((option, idx) => (
          <MenuItem key={idx} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <Controller
      name={field.id}
      control={control}
      defaultValue={field.defaultValue || ""}
      render={({ field: { onChange, value } }) => (
        <TextField {...commonProps} value={value} onChange={onChange}>
          {field.options?.map((option, idx) => (
            <MenuItem key={idx} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

DropdownField.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    required: PropTypes.bool,
    defaultValue: PropTypes.string,
  }).isRequired,
  control: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default DropdownField;
