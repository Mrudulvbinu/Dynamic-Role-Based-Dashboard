import React from "react";
import { Box, Typography, Paper } from "@mui/material";

// custom MUI field components
import TextField from "./fields/TextField";
import CheckboxField from "./fields/CheckboxField";
import DropdownField from "./fields/DropdownField";
import RadioButton from "./fields/RadioButton";
import DateField from "./fields/DateField";

const FormCanvas = ({ fields, onSelectField, addField }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("fieldType");
    if (fieldType) {
      addField(fieldType);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderField = (field) => {
    const previewProps = { field, isPreview: true };

    switch (field.type) {
      case "text":
      case "textfield":
        return <TextField {...previewProps} />;
      case "dropdown":
        return <DropdownField {...previewProps} />;
      case "checkbox":
        return <CheckboxField {...previewProps} />;
      case "radio":
        return <RadioButton {...previewProps} />;
      case "date":
        return <DateField {...previewProps} />;
      default:
        return <TextField {...previewProps} />;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        border: "7px dashed #ccc",
        maxHeight: "500px",
        overflowY: "auto",
        width: "100%",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {fields.length === 0 ? (
        <Typography variant="body2" color="textSecondary" align="center">
          Drag fields here to build your form.
        </Typography>
      ) : (
        fields.map((field) => (
          <Box
            key={field.id}
            onClick={() => onSelectField(field)}
            sx={{
              cursor: "pointer",
              border: "1px solid #eee",
              borderRadius: 1,
              p: 1,
              mb: 1,
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {renderField(field)}
          </Box>
        ))
      )}
    </Paper>
  );
};

export default FormCanvas;
