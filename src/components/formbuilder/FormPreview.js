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
} from "@mui/material";

const FormPreview = ({ form }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {form?.title || "Untitled Form"}
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {form?.fields?.map((field, index) => {
          if (!field || !field.label) return null;

          switch (field.type) {
            case "text":
              return (
                <TextField
                  key={index}
                  label={field.label}
                  variant="outlined"
                  fullWidth
                />
              );

            case "textarea":
              return (
                <TextField
                  key={index}
                  label={field.label}
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                />
              );

            case "select":
              return (
                <TextField key={index} label={field.label} select fullWidth>
                  {field.options?.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              );

            case "radio":
              return (
                <Box key={index}>
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup row>
                    {field.options?.map((option, i) => (
                      <FormControlLabel
                        key={i}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              );

            case "checkbox":
              return (
                <Box key={index}>
                  <FormLabel>{field.label}</FormLabel>
                  <Box>
                    {field.options?.map((option, i) => (
                      <FormControlLabel
                        key={i}
                        control={<Checkbox />}
                        label={option}
                      />
                    ))}
                  </Box>
                </Box>
              );

            case "date":
              return (
                <TextField
                  key={index}
                  label={field.label}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
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
