import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Divider,
  Collapse,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import tickGif from "../../assets/tick.gif";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PillInput from "./PillInput";

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
    parsedOptions: [],
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [expandedOptionIndex, setExpandedOptionIndex] = useState(null);

  // State for nested field dialog
  const [nestedFieldDialogOpen, setNestedFieldDialogOpen] = useState(false);
  const [currentOptionIndex, setCurrentOptionIndex] = useState(null);
  const [newNestedField, setNewNestedField] = useState({
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
      processedField.options = (newField.parsedOptions || []).filter(
        (opt) => opt.label.trim() !== ""
      );
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
      parsedOptions: [],
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
      // Nested fields validation
      field.options?.forEach((option) => {
        option.nestedFields?.forEach((nestedField) => {
          if (nestedField.required) {
            const nestedFieldName = `${field.id}.nested.${nestedField.id}`;
            switch (nestedField.type) {
              case "text":
              case "select":
              case "radio":
                shape[nestedFieldName] = yup
                  .string()
                  .required("This nested field is required");
                break;
            }
          }
        });
      });
    });
    return yup.object().shape(shape);
  }, [fields]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onTouched",
  });

  const formValues = watch();

  const onSubmit = (data) => {
    // Flatten the nested structure for submission
    const flattenedData = {};

    Object.keys(data).forEach((key) => {
      if (key.includes(".nested.")) {
        // Handle nested fields
        const [parentId, , nestedId] = key.split(".");
        if (!flattenedData[parentId]) {
          flattenedData[parentId] = {
            value: data[parentId],
            nested: {},
          };
        }
        flattenedData[parentId].nested[nestedId] = data[key];
      } else {
        // Handle regular fields
        flattenedData[key] = data[key];
      }
    });

    console.log("Form submitted! Data:", flattenedData);
    alert("Form submitted! Check console for complete data structure.");
    reset();
  };

  const toggleOptionExpand = (index) => {
    setExpandedOptionIndex(expandedOptionIndex === index ? null : index);
  };

  const openNestedFieldDialog = (optIdx) => {
    setCurrentOptionIndex(optIdx);
    setNestedFieldDialogOpen(true);
  };

  const closeNestedFieldDialog = () => {
    setNestedFieldDialogOpen(false);
    setNewNestedField({
      label: "",
      type: "text",
      required: false,
      options: "",
    });
  };

  const addNestedField = () => {
    if (!newNestedField.label.trim()) return;

    const processedNestedField = {
      ...newNestedField,
      id: uuidv4(),
    };

    if (["radio", "checkbox", "select"].includes(newNestedField.type)) {
      processedNestedField.options = newNestedField.options
        .split(",")
        .filter((opt) => opt.trim() !== "")
        .map((opt) => ({
          label: opt.trim(),
          value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
        }));
    } else {
      delete processedNestedField.options;
    }

    const updatedOptions = [...newField.parsedOptions];
    updatedOptions[currentOptionIndex].nestedFields.push(processedNestedField);

    setNewField({
      ...newField,
      parsedOptions: updatedOptions,
    });

    closeNestedFieldDialog();
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
          <>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Options:
              </Typography>
              <PillInput
                options={newField.parsedOptions}
                onChange={(newOptions) => {
                  setNewField({
                    ...newField,
                    parsedOptions: newOptions,
                    options: newOptions.map((opt) => opt.label).join(","),
                  });
                }}
              />
            </Box>

            {newField.parsedOptions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Configure Options:
                </Typography>
                {newField.parsedOptions.map((option, optIdx) => (
                  <Box key={optIdx} sx={{ mt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#f5f5f5",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography sx={{ flexGrow: 1 }}>
                        {option.label} ({option.value})
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => toggleOptionExpand(optIdx)}
                      >
                        {expandedOptionIndex === optIdx ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                    <Collapse in={expandedOptionIndex === optIdx}>
                      <Box sx={{ pl: 2, pt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Nested Fields for this option:
                        </Typography>
                        {option.nestedFields?.map((nf, nfIdx) => (
                          <Typography
                            key={nfIdx}
                            sx={{ fontSize: "0.9rem", color: "gray" }}
                          >
                            → {nf.label} ({nf.type})
                            {nf.options && ` [${nf.options.length} options]`}
                          </Typography>
                        ))}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => openNestedFieldDialog(optIdx)}
                        >
                          + Add Nested Field
                        </Button>
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Box>
            )}
          </>
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

      {/* Nested Field Dialog */}
      <Dialog
        open={nestedFieldDialogOpen}
        onClose={closeNestedFieldDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Nested Field</DialogTitle>
        <DialogContent>
          <TextField
            label="Label"
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            value={newNestedField.label}
            onChange={(e) =>
              setNewNestedField({ ...newNestedField, label: e.target.value })
            }
          />

          <TextField
            label="Field Type"
            variant="outlined"
            select
            fullWidth
            sx={{ mt: 2 }}
            value={newNestedField.type}
            onChange={(e) =>
              setNewNestedField({ ...newNestedField, type: e.target.value })
            }
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="radio">Radio</MenuItem>
            <MenuItem value="checkbox">Checkbox</MenuItem>
            <MenuItem value="select">Dropdown</MenuItem>
          </TextField>

          {["radio", "checkbox", "select"].includes(newNestedField.type) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Options:
              </Typography>
              <PillInput
                options={
                  newNestedField.options
                    ? newNestedField.options
                        .split(",")
                        .filter((opt) => opt.trim() !== "")
                        .map((opt) => ({
                          label: opt.trim(),
                          value: opt.trim().toLowerCase().replace(/\s+/g, "_"),
                        }))
                    : []
                }
                onChange={(newOptions) => {
                  setNewNestedField({
                    ...newNestedField,
                    options: newOptions.map((opt) => opt.label).join(","),
                  });
                }}
              />
            </Box>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={newNestedField.required}
                onChange={(e) =>
                  setNewNestedField({
                    ...newNestedField,
                    required: e.target.checked,
                  })
                }
              />
            }
            label="Required"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNestedFieldDialog}>Cancel</Button>
          <Button onClick={addNestedField} color="primary">
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

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
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Options:
                    </Typography>
                    {field.options.map((opt, i) => (
                      <Box key={i} sx={{ pl: 2 }}>
                        <Typography variant="body2">
                          - {opt.label}{" "}
                          {opt.nestedFields?.length > 0 &&
                            `(${opt.nestedFields.length} nested)`}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
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

              const renderNestedField = (
                nestedField,
                parentFieldId,
                parentValue,
                level = 0
              ) => {
                const fieldName = `${parentFieldId}.nested.${nestedField.id}`;
                const indent = level * 2;

                switch (nestedField.type) {
                  case "select":
                    return (
                      <Box key={nestedField.id} sx={{ pl: indent, mt: 1 }}>
                        <Controller
                          name={fieldName}
                          control={control}
                          defaultValue=""
                          render={({ field: controllerField }) => (
                            <FormControl fullWidth margin="normal">
                              <InputLabel>{`↳ ${nestedField.label}`}</InputLabel>
                              <Select
                                {...controllerField}
                                label={`↳ ${nestedField.label}`}
                              >
                                {nestedField.options?.map((opt, i) => (
                                  <MenuItem key={i} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </Box>
                    );
                  case "date":
                    return (
                      <Box key={nestedField.id} sx={{ pl: indent, mt: 1 }}>
                        <Controller
                          name={fieldName}
                          control={control}
                          defaultValue=""
                          render={({ field: controllerField }) => (
                            <TextField
                              {...controllerField}
                              label={`↳ ${nestedField.label}`}
                              type="date"
                              fullWidth
                              margin="normal"
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Box>
                    );
                  case "radio":
                    return (
                      <Box key={nestedField.id} sx={{ pl: indent, mt: 1 }}>
                        <FormLabel>{`↳ ${nestedField.label}`}</FormLabel>
                        <Controller
                          name={fieldName}
                          control={control}
                          defaultValue=""
                          render={({ field: controllerField }) => (
                            <RadioGroup {...controllerField}>
                              {nestedField.options?.map((opt, i) => (
                                <Box key={i}>
                                  <FormControlLabel
                                    value={opt.value}
                                    control={<Radio />}
                                    label={opt.label}
                                  />
                                  {controllerField.value === opt.value &&
                                    opt.nestedFields?.map((nf) =>
                                      renderNestedField(
                                        nf,
                                        opt.value,
                                        level + 1
                                      )
                                    )}
                                </Box>
                              ))}
                            </RadioGroup>
                          )}
                        />
                      </Box>
                    );
                  case "checkbox":
                    return (
                      <Box key={nestedField.id} sx={{ pl: indent, mt: 1 }}>
                        <FormLabel>{`↳ ${nestedField.label}`}</FormLabel>
                        <Controller
                          name={fieldName}
                          control={control}
                          defaultValue={[]}
                          render={({ field: controllerField }) => (
                            <Box>
                              {nestedField.options?.map((opt, i) => (
                                <FormControlLabel
                                  key={i}
                                  control={
                                    <Checkbox
                                      checked={(
                                        controllerField.value || []
                                      ).includes(opt.value)}
                                      onChange={(e) => {
                                        const newValue = e.target.checked
                                          ? [
                                              ...(controllerField.value || []),
                                              opt.value,
                                            ]
                                          : (
                                              controllerField.value || []
                                            ).filter((v) => v !== opt.value);
                                        controllerField.onChange(newValue);
                                      }}
                                    />
                                  }
                                  label={opt.label}
                                />
                              ))}
                            </Box>
                          )}
                        />
                      </Box>
                    );
                  case "select":
                    return (
                      <Box key={field.id}>
                        <Controller
                          name={field.id}
                          control={control}
                          defaultValue=""
                          render={({ field: controllerField }) => (
                            <FormControl fullWidth margin="normal">
                              <InputLabel>{field.label}</InputLabel>
                              <Select
                                {...controllerField}
                                label={field.label}
                                error={!!errors[field.id]}
                              >
                                {field.options?.map((option, i) => (
                                  <MenuItem key={i} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                        {field.options
                          ?.find((opt) => opt.value === formValues[field.id])
                          ?.nestedFields?.map((nestedField) =>
                            renderNestedField(
                              nestedField,
                              field.id,
                              formValues[field.id]
                            )
                          )}
                      </Box>
                    );
                  default:
                    return null;
                }
              };

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
                    <Box key={field.id}>
                      <Controller
                        name={field.id}
                        control={control}
                        defaultValue=""
                        render={({ field: controllerField }) => (
                          <FormControl fullWidth margin="normal">
                            <InputLabel>{field.label}</InputLabel>
                            <Select
                              {...controllerField}
                              label={field.label}
                              error={!!errors[field.id]}
                            >
                              {field.options?.map((option, i) => (
                                <MenuItem key={i} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                      {field.options
                        ?.find((opt) => opt.value === formValues[field.id])
                        ?.nestedFields?.map((nestedField) =>
                          renderNestedField(nestedField, formValues[field.id])
                        )}
                    </Box>
                  );

                case "radio":
                  return (
                    <Box key={field.id}>
                      <Controller
                        name={field.id}
                        control={control}
                        defaultValue=""
                        render={({ field: controllerField }) => (
                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography sx={{ mb: 1 }}>
                              {field.label}
                            </Typography>
                            <RadioGroup {...controllerField}>
                              {field.options?.map((option, i) => (
                                <Box key={i}>
                                  <FormControlLabel
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                  />
                                  {controllerField.value === option.value &&
                                    option.nestedFields?.map((nestedField) =>
                                      renderNestedField(
                                        nestedField,
                                        option.value
                                      )
                                    )}
                                </Box>
                              ))}
                            </RadioGroup>
                            {errors[field.id] && (
                              <Typography color="error" variant="body2">
                                {errors[field.id]?.message}
                              </Typography>
                            )}
                          </Box>
                        )}
                      />
                    </Box>
                  );

                case "checkbox":
                  return (
                    <Box key={field.id}>
                      <Controller
                        name={field.id}
                        control={control}
                        defaultValue={[]}
                        render={({ field: controllerField }) => (
                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography sx={{ mb: 1 }}>
                              {field.label}
                            </Typography>
                            {field.options?.map((option, i) => {
                              const checked = (
                                controllerField.value || []
                              ).includes(option.value);
                              return (
                                <Box key={i}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={checked}
                                        onChange={(e) => {
                                          const newValue = e.target.checked
                                            ? [
                                                ...(controllerField.value ||
                                                  []),
                                                option.value,
                                              ]
                                            : (
                                                controllerField.value || []
                                              ).filter(
                                                (v) => v !== option.value
                                              );
                                          controllerField.onChange(newValue);
                                        }}
                                      />
                                    }
                                    label={option.label}
                                  />
                                  {checked &&
                                    option.nestedFields?.map((nestedField) =>
                                      renderNestedField(
                                        nestedField,
                                        option.value
                                      )
                                    )}
                                </Box>
                              );
                            })}
                            {errors[field.id] && (
                              <Typography color="error" variant="body2">
                                {errors[field.id]?.message}
                              </Typography>
                            )}
                          </Box>
                        )}
                      />
                    </Box>
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
