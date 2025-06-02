import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const FieldEditor = ({ selectedField, updateField, deleteField }) => {
  const [localField, setLocalField] = useState(null);

  useEffect(() => {
    if (selectedField) {
      setLocalField({ ...selectedField });
    } else {
      setLocalField(null);
    }
  }, [selectedField]);

  if (!localField) {
    return (
      <Box sx={{ width: 300, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Select a field to edit
        </Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalField((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionsChange = (e) => {
    const options = e.target.value.split(",").map((opt) => opt.trim());
    setLocalField((prev) => ({
      ...prev,
      options,
    }));
  };

  const saveChanges = () => {
    updateField(localField);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      deleteField(localField.id);
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Edit Field
      </Typography>

      <TextField
        label="Label"
        name="label"
        value={localField.label}
        onChange={handleChange}
      />

      {localField.type === "dropdown" && (
        <TextField
          label="Options (comma separated)"
          value={localField.options?.join(", ") || ""}
          onChange={handleOptionsChange}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            name="required"
            checked={!!localField.required}
            onChange={handleChange}
          />
        }
        label="Required"
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={saveChanges} fullWidth>
          Save
        </Button>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDelete}
          size="large"
          sx={{ alignSelf: "center" }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FieldEditor;
