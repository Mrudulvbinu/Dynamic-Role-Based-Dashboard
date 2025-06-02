import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

const formFields = [
  { type: "textfield", label: "Text Field" },
  { type: "dropdown", label: "Dropdown" },
  { type: "checkbox", label: "Checkbox" },
  { type: "date", label: "Date" },
  { type: "radio", label: "Radio Buttons" },
  { type: "label", label: "Label" },
];

const FormFieldsList = ({ addField }) => {
  return (
    <Box
      sx={{
        width: 240,
        mr: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 2,
        height: "fit-content",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Form Fields
      </Typography>
      <Stack spacing={1}>
        {formFields.map((field) => (
          <Button
            key={field.type}
            variant="outlined"
            onClick={() => addField(field.type)}
          >
            {field.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

export default FormFieldsList;
