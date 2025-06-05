import React from "react";
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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";

const FormPreview = ({ form, control, errors, watch }) => {
  const renderNestedField = (
    parentFieldId,
    optionValue,
    nestedField,
    level = 0
  ) => {
    if (!nestedField || !nestedField.id || !nestedField.label) return null;

    const fieldName = `${parentFieldId}.nested.${nestedField.id}`;
    const indent = level * 2;

    switch (nestedField.type) {
      case "text":
        return (
          <Box key={nestedField.id} sx={{ pl: indent, mt: 1 }}>
            <Controller
              name={fieldName}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`↳ ${nestedField.label}`}
                  fullWidth
                  margin="normal"
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName]?.message}
                />
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
              render={({ field }) => (
                <TextField
                  {...field}
                  label={`↳ ${nestedField.label}`}
                  type="date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName]?.message}
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
              render={({ field }) => (
                <RadioGroup {...field}>
                  {Array.isArray(nestedField.options) &&
                    nestedField.options.map((opt, i) => (
                      <Box key={i}>
                        <FormControlLabel
                          value={opt.value}
                          control={<Radio />}
                          label={opt.label}
                        />
                        {field.value === opt.value &&
                          Array.isArray(opt.nestedFields) &&
                          opt.nestedFields.map((nf) =>
                            nf
                              ? renderNestedField(
                                  parentFieldId,
                                  opt.value,
                                  nf,
                                  level + 1
                                )
                              : null
                          )}
                      </Box>
                    ))}
                </RadioGroup>
              )}
            />
            {errors[fieldName] && (
              <Typography color="error" variant="body2">
                {errors[fieldName]?.message}
              </Typography>
            )}
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
              render={({ field }) => (
                <Box>
                  {Array.isArray(nestedField.options) &&
                    nestedField.options.map((opt, i) => {
                      const checked = (field.value || []).includes(opt.value);
                      return (
                        <Box key={i}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checked}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...(field.value || []), opt.value]
                                    : (field.value || []).filter(
                                        (v) => v !== opt.value
                                      );
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={opt.label}
                          />
                          {checked &&
                            Array.isArray(opt.nestedFields) &&
                            opt.nestedFields.map((nf) =>
                              nf
                                ? renderNestedField(
                                    parentFieldId,
                                    opt.value,
                                    nf,
                                    level + 1
                                  )
                                : null
                            )}
                        </Box>
                      );
                    })}
                </Box>
              )}
            />
            {errors[fieldName] && (
              <Typography color="error" variant="body2">
                {errors[fieldName]?.message}
              </Typography>
            )}
          </Box>
        );

      case "select":
        return (
          <Box key={nestedField.id} sx={{ pl: indent, mt: 1 }}>
            <Controller
              name={fieldName}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{`↳ ${nestedField.label}`}</InputLabel>
                  <Select
                    {...field}
                    label={`↳ ${nestedField.label}`}
                    error={!!errors[fieldName]}
                  >
                    {Array.isArray(nestedField.options) &&
                      nestedField.options.map((opt, i) => (
                        <MenuItem key={i} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors[fieldName] && (
              <Typography color="error" variant="body2">
                {errors[fieldName]?.message}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {form?.title || "Untitled Form"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {form?.description || ""}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                <Controller
                  key={index}
                  name={fieldId}
                  control={control}
                  defaultValue=""
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      label={field.label}
                      fullWidth
                      margin="normal"
                      error={!!errors[fieldId]}
                      helperText={errors[fieldId]?.message}
                    />
                  )}
                />
              );

            case "date":
              return (
                <Controller
                  key={index}
                  name={fieldId}
                  control={control}
                  defaultValue=""
                  render={({ field: controllerField }) => (
                    <TextField
                      {...controllerField}
                      label={field.label}
                      type="date"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors[fieldId]}
                      helperText={errors[fieldId]?.message}
                    />
                  )}
                />
              );

            case "select":
              return (
                <Box key={index}>
                  <Controller
                    name={fieldId}
                    control={control}
                    defaultValue=""
                    render={({ field: controllerField }) => (
                      <FormControl fullWidth margin="normal">
                        <InputLabel>{field.label}</InputLabel>
                        <Select
                          {...controllerField}
                          label={field.label}
                          error={!!errors[fieldId]}
                        >
                          {Array.isArray(field.options) &&
                            field.options.map((option, i) => (
                              <MenuItem key={i} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {errors[fieldId] && (
                    <Typography color="error" variant="body2">
                      {errors[fieldId]?.message}
                    </Typography>
                  )}
                  {Array.isArray(field.options) &&
                    field.options
                      .find((opt) => opt.value === watch(fieldId))
                      ?.nestedFields?.map((nestedField) =>
                        nestedField
                          ? renderNestedField(
                              fieldId,
                              watch(fieldId),
                              nestedField
                            )
                          : null
                      )}
                </Box>
              );

            case "radio":
              return (
                <Box key={index}>
                  <Controller
                    name={fieldId}
                    control={control}
                    defaultValue=""
                    render={({ field: controllerField }) => (
                      <>
                        <FormLabel>{field.label}</FormLabel>
                        <RadioGroup {...controllerField}>
                          {Array.isArray(field.options) &&
                            field.options.map((option, i) => (
                              <Box key={i}>
                                <FormControlLabel
                                  value={option.value}
                                  control={<Radio />}
                                  label={option.label}
                                />
                                {controllerField.value === option.value &&
                                  Array.isArray(option.nestedFields) &&
                                  option.nestedFields.map((nestedField) =>
                                    nestedField
                                      ? renderNestedField(
                                          fieldId,
                                          option.value,
                                          nestedField
                                        )
                                      : null
                                  )}
                              </Box>
                            ))}
                        </RadioGroup>
                      </>
                    )}
                  />
                  {errors[fieldId] && (
                    <Typography color="error" variant="body2">
                      {errors[fieldId]?.message}
                    </Typography>
                  )}
                </Box>
              );

            case "checkbox":
              return (
                <Box key={index}>
                  <Controller
                    name={fieldId}
                    control={control}
                    defaultValue={[]}
                    render={({ field: controllerField }) => (
                      <>
                        <FormLabel>{field.label}</FormLabel>
                        <Box>
                          {Array.isArray(field.options) &&
                            field.options.map((option, i) => {
                              const checked = (
                                controllerField.value || []
                              ).includes(option.value);
                              return (
                                <Box key={i} sx={{ mb: 1 }}>
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
                                    Array.isArray(option.nestedFields) &&
                                    option.nestedFields.map((nestedField) =>
                                      nestedField
                                        ? renderNestedField(
                                            fieldId,
                                            option.value,
                                            nestedField
                                          )
                                        : null
                                    )}
                                </Box>
                              );
                            })}
                        </Box>
                      </>
                    )}
                  />
                  {errors[fieldId] && (
                    <Typography color="error" variant="body2">
                      {errors[fieldId]?.message}
                    </Typography>
                  )}
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

export default FormPreview;
