import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const PrintableForm = ({ form }) => {
  const [formData, setFormData] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [nestedValues, setNestedValues] = useState({});

  const handleSelection = (fieldId, optionValue, isCheckbox = false) => {
    if (isCheckbox) {
      const current = selectedValues[fieldId] || [];
      const updated = current.includes(optionValue)
        ? current.filter((val) => val !== optionValue)
        : [...current, optionValue];
      setSelectedValues({ ...selectedValues, [fieldId]: updated });
      setFormData((prev) => ({ ...prev, [fieldId]: updated }));
    } else {
      setSelectedValues({ ...selectedValues, [fieldId]: optionValue });
      setFormData((prev) => ({ ...prev, [fieldId]: optionValue }));
    }
  };

  const handleNestedChange = (fieldId, optionValue, nestedFieldId, value) => {
    setNestedValues((prev) => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        [optionValue]: {
          ...prev[fieldId]?.[optionValue],
          [nestedFieldId]: value,
        },
      },
    }));
    setFormData((prev) => ({
      ...prev,
      [`${fieldId}_${nestedFieldId}`]: value,
    }));
  };

  const renderNestedField = (fieldId, optionValue, nestedField) => {
    const value = nestedValues[fieldId]?.[optionValue]?.[nestedField.id] || "";

    switch (nestedField.type) {
      case "text":
        return (
          <TextField
            key={nestedField.id}
            label={`↳ ${nestedField.label}`}
            variant="outlined"
            fullWidth
            sx={{ mt: 1, ml: 2, mb: 2 }}
            value={value}
            onChange={(e) =>
              handleNestedChange(
                fieldId,
                optionValue,
                nestedField.id,
                e.target.value
              )
            }
          />
        );
      case "date":
        return (
          <TextField
            key={nestedField.id}
            label={`↳ ${nestedField.label}`}
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 1, ml: 2, mb: 2 }}
            value={value}
            onChange={(e) =>
              handleNestedChange(
                fieldId,
                optionValue,
                nestedField.id,
                e.target.value
              )
            }
          />
        );
      case "radio":
        return (
          <Box key={nestedField.id} sx={{ mt: 1, ml: 2, mb: 2 }}>
            <FormLabel>{`↳ ${nestedField.label}`}</FormLabel>
            <RadioGroup
              value={value || ""}
              onChange={(e) =>
                handleNestedChange(
                  fieldId,
                  optionValue,
                  nestedField.id,
                  e.target.value
                )
              }
            >
              {nestedField.options?.map((opt, i) => (
                <FormControlLabel
                  key={i}
                  value={opt.value}
                  control={<Radio />}
                  label={opt.label}
                />
              ))}
            </RadioGroup>
          </Box>
        );
      case "checkbox":
        return (
          <Box key={nestedField.id} sx={{ mt: 1, ml: 2, mb: 2 }}>
            <FormLabel>{`↳ ${nestedField.label}`}</FormLabel>
            {nestedField.options?.map((opt, i) => {
              const checked = (value || []).includes(opt.value);
              return (
                <FormControlLabel
                  key={i}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => {
                        const newValue = checked
                          ? (value || []).filter((v) => v !== opt.value)
                          : [...(value || []), opt.value];
                        handleNestedChange(
                          fieldId,
                          optionValue,
                          nestedField.id,
                          newValue
                        );
                      }}
                    />
                  }
                  label={opt.label}
                />
              );
            })}
          </Box>
        );
      case "select":
        return (
          <FormControl
            fullWidth
            sx={{ mt: 1, ml: 2, mb: 2 }}
            key={nestedField.id}
          >
            <InputLabel>{`↳ ${nestedField.label}`}</InputLabel>
            <Select
              value={value || ""}
              label={`↳ ${nestedField.label}`}
              onChange={(e) =>
                handleNestedChange(
                  fieldId,
                  optionValue,
                  nestedField.id,
                  e.target.value
                )
              }
            >
              {nestedField.options?.map((opt, i) => (
                <MenuItem key={i} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const renderNestedFields = (fieldId, optionValue, nestedFields) => {
    return nestedFields?.map((nestedField) => (
      <Box key={nestedField.id}>
        {renderNestedField(fieldId, optionValue, nestedField)}
        {nestedField.options?.find(
          (opt) =>
            opt.value === nestedValues[fieldId]?.[optionValue]?.[nestedField.id]
        )?.nestedFields && (
          <Box sx={{ ml: 4 }}>
            {renderNestedFields(
              fieldId,
              optionValue,
              nestedField.options.find(
                (opt) =>
                  opt.value ===
                  nestedValues[fieldId]?.[optionValue]?.[nestedField.id]
              )?.nestedFields
            )}
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {form?.title || "Untitled Form"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {form?.description || ""}
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {form?.fields?.map((field, index) => {
          if (!field || !field.label) return null;
          const fieldId = field.id || `${field.label}-${index}`;

          if (field.type === "heading") {
            return (
              <Typography
                key={index}
                variant="h6"
                sx={{ mt: 3, mb: 1, color: "primary.main", fontWeight: "bold" }}
              >
                {field.label}
              </Typography>
            );
          }

          switch (field.type) {
            case "text":
              return (
                <TextField
                  key={index}
                  label={field.label}
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={formData[fieldId] || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [fieldId]: e.target.value,
                    }));
                  }}
                />
              );

            case "date":
              return (
                <TextField
                  key={index}
                  label={field.label}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={formData[fieldId] || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [fieldId]: e.target.value,
                    }));
                  }}
                />
              );

            case "select":
              return (
                <Box key={index}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                      value={selectedValues[fieldId] || ""}
                      label={field.label}
                      onChange={(e) => handleSelection(fieldId, e.target.value)}
                    >
                      {field.options?.map((option, i) => (
                        <MenuItem key={i} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {field.options?.find(
                    (opt) => opt.value === selectedValues[fieldId]
                  )?.nestedFields &&
                    renderNestedFields(
                      fieldId,
                      selectedValues[fieldId],
                      field.options.find(
                        (opt) => opt.value === selectedValues[fieldId]
                      )?.nestedFields
                    )}
                </Box>
              );

            case "radio":
              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup
                    value={selectedValues[fieldId] || ""}
                    onChange={(e) => handleSelection(fieldId, e.target.value)}
                  >
                    {field.options?.map((option, i) => (
                      <Box key={i}>
                        <FormControlLabel
                          value={option.value}
                          control={<Radio />}
                          label={option.label}
                        />
                        {selectedValues[fieldId] === option.value &&
                          renderNestedFields(
                            fieldId,
                            option.value,
                            option.nestedFields
                          )}
                      </Box>
                    ))}
                  </RadioGroup>
                </Box>
              );

            case "checkbox":
              return (
                <Box key={index} sx={{ mb: 2 }}>
                  <FormLabel>{field.label}</FormLabel>
                  <Box>
                    {field.options?.map((option, i) => {
                      const checked =
                        selectedValues[fieldId]?.includes(option.value) ||
                        false;

                      return (
                        <Box key={i} sx={{ mb: 1 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checked}
                                onChange={() =>
                                  handleSelection(fieldId, option.value, true)
                                }
                              />
                            }
                            label={option.label}
                          />
                          {checked &&
                            renderNestedFields(
                              fieldId,
                              option.value,
                              option.nestedFields
                            )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              );

            default:
              return null;
          }
        })}
      </Box>
    </Box>
  );
};

export default PrintableForm;
