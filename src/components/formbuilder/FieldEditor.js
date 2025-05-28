import React from 'react';
import { Box, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';

const FieldEditor = ({ selectedField, updateField }) => {
  if (!selectedField) {
    return (
      <Box sx={{ width: 300, p: 2, borderLeft: '1px solid #eee' }}>
        <Typography>Select a field to edit</Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    updateField({
      ...selectedField,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ width: 300, p: 2, borderLeft: '1px solid #eee' }}>
      <Typography variant="h6">Field Properties</Typography>
      <TextField
        name="label"
        label="Label"
        value={selectedField.label}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            name="required"
            checked={selectedField.required}
            onChange={(e) => updateField({
              ...selectedField,
              required: e.target.checked
            })}
          />
        }
        label="Required"
      />
      {/* Add more field-specific properties here */}
    </Box>
  );
};

export default FieldEditor;