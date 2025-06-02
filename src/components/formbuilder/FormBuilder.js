import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const FormBuilder = ({ setActiveTab }) => {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [editingFormId, setEditingFormId] = useState(null);
  const [newField, setNewField] = useState({
    label: "",
    type: "text",
    required: false,
    options: "",
  });

  useEffect(() => {
    const editingId = localStorage.getItem("formToEdit");
    if (editingId) {
      const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
      const formToEdit = savedForms.find((form) => form.id === editingId);
      if (formToEdit) {
        setFormTitle(formToEdit.title);
        setFormDescription(formToEdit.description);
        setFields(formToEdit.fields);
        setEditingFormId(formToEdit.id);
      }
      localStorage.removeItem("formToEdit");
    }
  }, []);

  const handleAddField = () => {
    if (!newField.label.trim()) return;

    const processedField = {
      ...newField,
      id: uuidv4(),
    };

    if (["radio", "checkbox", "select"].includes(newField.type)) {
      processedField.options = newField.options
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt !== "");
    } else {
      delete processedField.options;
    }

    setFields([...fields, processedField]);

    setNewField({
      label: "",
      type: "text",
      required: false,
      options: "",
    });
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleSaveForm = () => {
    if (!formTitle.trim() || fields.length === 0) return;

    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];

    if (editingFormId) {
      const updatedForms = savedForms.map((form) =>
        form.id === editingFormId
          ? {
              ...form,
              title: formTitle,
              description: formDescription,
              fields,
              updatedAt: new Date().toISOString(),
            }
          : form
      );
      localStorage.setItem("forms", JSON.stringify(updatedForms));
      alert("Form updated successfully!");
    } else {
      const newForm = {
        id: uuidv4(),
        title: formTitle,
        description: formDescription,
        fields,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("forms", JSON.stringify([...savedForms, newForm]));
      alert("Form saved successfully!");
    }

    setActiveTab("savedForms");
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h4" gutterBottom>
        {editingFormId ? "Edit Form" : "Create a New Form"}
      </Typography>

      <TextField
        label="Form Title"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />

      <TextField
        label="Form Description"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
      />

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Add New Field</Typography>

        <TextField
          label="Label"
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />

        <TextField
          label="Field Type"
          variant="outlined"
          select
          fullWidth
          sx={{ mt: 2 }}
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value })}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="radio">Radio</MenuItem>
          <MenuItem value="checkbox">Checkbox</MenuItem>
          <MenuItem value="select">Dropdown</MenuItem>
        </TextField>

        {["radio", "checkbox", "select"].includes(newField.type) && (
          <TextField
            label="Options (comma-separated)"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={newField.options}
            onChange={(e) =>
              setNewField({ ...newField, options: e.target.value })
            }
          />
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={newField.required}
              onChange={(e) =>
                setNewField({ ...newField, required: e.target.checked })
              }
            />
          }
          label="Required"
          sx={{ mt: 2 }}
        />

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddField}>
          Add Field
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom>
        Fields Added
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {fields.length === 0 ? (
        <Typography>No fields added yet.</Typography>
      ) : (
        fields.map((field, idx) => (
          <Paper
            key={field.id}
            elevation={2}
            sx={{ mb: 2, p: 2, border: "1px solid #ccc" }}
          >
            <Typography>
              <strong>
                {idx + 1}. {field.label}
              </strong>{" "}
              ({field.type}){field.required && " *"}
            </Typography>
            {field.options && Array.isArray(field.options) && (
              <Typography variant="body2" color="text.secondary">
                Options: {field.options.join(", ")}
              </Typography>
            )}
            <Button
              size="small"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => handleRemoveField(field.id)}
            >
              Remove
            </Button>
          </Paper>
        ))
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveForm}
        sx={{ mt: 4 }}
      >
        {editingFormId ? "Update Form" : "Save Form"}
      </Button>
    </Box>
  );
};

export default FormBuilder;
