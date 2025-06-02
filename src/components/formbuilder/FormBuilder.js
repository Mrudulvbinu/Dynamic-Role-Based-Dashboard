import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Typography,
  TextField,
} from "@mui/material";
import FormFieldsList from "./FormFieldsList";
import FormCanvas from "./FormCanvas";
import FieldEditor from "./FieldEditor";

const FormBuilder = ({ onCancelEdit = () => {} }) => {
  const [form, setForm] = useState({
    id: "",
    title: "Untitled Form",
    description: "",
    fields: [],
    createdAt: "",
    updatedAt: "",
  });
  const [lastAction, setLastAction] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const editFormId = localStorage.getItem("formToEdit");
    if (editFormId) {
      const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
      const formToEdit = savedForms.find((f) => f.id === editFormId);
      if (formToEdit) {
        setForm(formToEdit);
        setIsEditing(true);
      }
    }
  }, []);

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      ...(type === "dropdown" && { options: ["Option 1"] }),
      ...(type === "checkbox" && { checked: false }),
      x: 0,
      y: 0,
      w: 4,
      h: 1,
    };
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (updatedField) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      ),
    }));
  };

  const updateFields = (newFields) => {
    setForm((prev) => ({
      ...prev,
      fields: newFields,
    }));
  };

  const deleteField = (fieldId) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }));

    if (selectedField && selectedField.id === fieldId) {
      setSelectedField(null);
    }
  };

  const saveForm = () => {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    let updatedForms;

    if (isEditing) {
      const updatedForm = {
        ...form,
        updatedAt: new Date().toISOString(),
      };
      updatedForms = savedForms.map((f) =>
        f.id === updatedForm.id ? updatedForm : f
      );
      setForm(updatedForm);
      setLastAction("update"); // ✅ Mark this as update
    } else {
      const newForm = {
        ...form,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedForms = [...savedForms, newForm];
      setForm(newForm);
      setIsEditing(true); // only after new form is saved
      setLastAction("save"); // ✅ Mark this as save
    }

    localStorage.setItem("forms", JSON.stringify(updatedForms));
    localStorage.removeItem("formToEdit");
    setShowSuccess(true);
  };

  const handleTitleChange = (e) => {
    setForm((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ px: 4, py: 2 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? "Edit Form" : "New Form"}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Form Title"
            value={form.title}
            onChange={handleTitleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Form Description"
            value={form.description}
            onChange={handleDescriptionChange}
          />
        </Box>

        <Box sx={{ display: "flex", height: "calc(100vh - 300px)" }}>
          <FormFieldsList addField={addField} />
          <FormCanvas
            fields={form.fields}
            setFields={updateFields}
            setSelectedField={setSelectedField}
            deleteField={deleteField}
          />
          <FieldEditor
            selectedField={selectedField}
            updateField={updateField}
            deleteField={deleteField}
          />
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            gap: 2,
            mt: 3,
          }}
        >
          <Button variant="contained" onClick={saveForm}>
            {isEditing ? "Update Form" : "Save Form"}
          </Button>
          {isEditing && (
            <Button
              variant="outlined"
              onClick={onCancelEdit}
              sx={{ width: "100%" }}
            >
              Cancel
            </Button>
          )}
        </Box>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            sx={{
              width: "450px",
              fontSize: "1.8rem",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
            }}
            iconMapping={{
              success: <span style={{ fontSize: 40 }}>✅</span>,
            }}
          >
            {lastAction === "update"
              ? "Form updated successfully!"
              : "Form saved successfully!"}
          </Alert>
        </Snackbar>
      </Box>
    </DndProvider>
  );
};

export default FormBuilder;
