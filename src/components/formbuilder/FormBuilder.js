import React, { useState, useEffect, useMemo } from "react";
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
import tickGif from "../../assets/tick.gif";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

    if (newField.type === "heading") {
      processedField.required = false;
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
    } else {
      const newForm = {
        id: uuidv4(),
        title: formTitle,
        description: formDescription,
        fields,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("forms", JSON.stringify([...savedForms, newForm]));
    }

    setSuccessMessage(
      editingFormId
        ? "Form updated successfully!"
        : "Form created successfully!"
    );
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab("forms");
    }, 3000);
  };

  // Dynamic Yup schema from fields
  const validationSchema = useMemo(() => {
    const shape = {};
    fields.forEach((field) => {
      if (field.type === "heading") return;
      if (field.required) {
        switch (field.type) {
          case "text":
          case "select":
          case "radio":
            shape[field.id] = yup.string().required("This field is required");
            break;
          case "date":
            shape[field.id] = yup
              .date()
              .typeError("Invalid date")
              .required("This field is required");
            break;
          case "checkbox":
            shape[field.id] = yup
              .array()
              .min(1, "Select at least one option")
              .required("This field is required");
            break;
          default:
            shape[field.id] = yup.string().required("This field is required");
        }
      }
    });
    return yup.object().shape(shape);
  }, [fields]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    alert("Form submitted! Data:\n" + JSON.stringify(data, null, 2));
    reset();
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
          <MenuItem value="heading">Heading</MenuItem>
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

        {newField.type !== "heading" && (
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
        )}

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddField}>
          Add Field
        </Button>
      </Paper>

      <Typography variant="h5" gutterBottom>
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
            {field.type === "heading" ? (
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
                {idx + 1}. {field.label}
              </Typography>
            ) : (
              <>
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
              </>
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

      {/* --- LIVE FORM PREVIEW WITH VALIDATION --- */}
      <Box sx={{ mt: 5, mb: 8 }}>
        <Typography variant="h5" gutterBottom>
          Live Form Preview
        </Typography>
        {fields.length === 0 ? (
          <Typography>No fields to preview</Typography>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {fields.map((field) => {
              if (field.type === "heading") {
                return (
                  <Typography
                    key={field.id}
                    variant="h6"
                    sx={{ fontWeight: "bold", mt: 3, mb: 1 }}
                  >
                    {field.label}
                  </Typography>
                );
              }

              // Render fields by type
              switch (field.type) {
                case "text":
                  return (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue=""
                      render={({ field: controllerField }) => (
                        <TextField
                          {...controllerField}
                          label={field.label}
                          fullWidth
                          margin="normal"
                          error={!!errors[field.id]}
                          helperText={errors[field.id]?.message}
                        />
                      )}
                    />
                  );

                case "date":
                  return (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue=""
                      render={({ field: controllerField }) => (
                        <TextField
                          {...controllerField}
                          type="date"
                          label={field.label}
                          fullWidth
                          margin="normal"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors[field.id]}
                          helperText={errors[field.id]?.message}
                        />
                      )}
                    />
                  );

                case "select":
                  return (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue=""
                      render={({ field: controllerField }) => (
                        <TextField
                          {...controllerField}
                          select
                          label={field.label}
                          fullWidth
                          margin="normal"
                          error={!!errors[field.id]}
                          helperText={errors[field.id]?.message}
                        >
                          {field.options.map((option, i) => (
                            <MenuItem key={i} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  );

                case "radio":
                  return (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue=""
                      render={({ field: controllerField }) => (
                        <Box sx={{ mt: 2, mb: 1 }}>
                          <Typography sx={{ mb: 1 }}>{field.label}</Typography>
                          {field.options.map((option, i) => (
                            <FormControlLabel
                              key={i}
                              control={
                                <Checkbox
                                  checked={controllerField.value === option}
                                  onChange={() =>
                                    controllerField.onChange(option)
                                  }
                                />
                              }
                              label={option}
                            />
                          ))}
                          {errors[field.id] && (
                            <Typography color="error" variant="body2">
                              {errors[field.id]?.message}
                            </Typography>
                          )}
                        </Box>
                      )}
                    />
                  );

                case "checkbox":
                  return (
                    <Controller
                      key={field.id}
                      name={field.id}
                      control={control}
                      defaultValue={[]}
                      render={({ field: controllerField }) => {
                        const handleChange = (option) => {
                          const currentValue = controllerField.value || [];
                          if (currentValue.includes(option)) {
                            controllerField.onChange(
                              currentValue.filter((v) => v !== option)
                            );
                          } else {
                            controllerField.onChange([...currentValue, option]);
                          }
                        };

                        return (
                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography sx={{ mb: 1 }}>
                              {field.label}
                            </Typography>
                            {field.options.map((option, i) => (
                              <FormControlLabel
                                key={i}
                                control={
                                  <Checkbox
                                    checked={
                                      controllerField.value
                                        ? controllerField.value.includes(option)
                                        : false
                                    }
                                    onChange={() => handleChange(option)}
                                  />
                                }
                                label={option}
                              />
                            ))}
                            {errors[field.id] && (
                              <Typography color="error" variant="body2">
                                {errors[field.id]?.message}
                              </Typography>
                            )}
                          </Box>
                        );
                      }}
                    />
                  );

                default:
                  return null;
              }
            })}

            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{ mt: 3 }}
            >
              Submit Preview Form
            </Button>
          </form>
        )}
      </Box>

      {showSuccess && (
        <Box
          sx={{
            position: "fixed",
            top: "15%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 3,
            p: 3,
            borderRadius: 2,
            textAlign: "center",
            zIndex: 9999,
          }}
        >
          <img src={tickGif} alt="Success" width={80} />
          <Typography sx={{ mt: 2 }}>{successMessage}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default FormBuilder;
