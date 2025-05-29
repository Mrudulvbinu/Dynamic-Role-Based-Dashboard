import React from "react";
import { useDrop } from "react-dnd";
import { Box, Typography } from "@mui/material";
import FieldComponent from "./FieldComponent";

const FormCanvas = ({ fields = [], setFields, setSelectedField }) => {
  const [, drop] = useDrop(() => ({
    accept: "field",
    drop: () => ({ name: "FormCanvas" }),
  }));

  const moveField = (dragIndex, hoverIndex) => {
    const draggedField = fields[dragIndex];
    const newFields = [...fields];
    newFields.splice(dragIndex, 1);
    newFields.splice(hoverIndex, 0, draggedField);
    setFields(newFields);
  };

  return (
    <Box
      ref={drop}
      sx={{
        flex: 1,
        p: 2,
        minHeight: "500px",
        border: "1px dashed #ccc",
        borderRadius: 1,
      }}
    >
      {fields && fields.length > 0 ? (
        fields.map((field, index) =>
          field && field.id ? (
            <FieldComponent
              key={field.id}
              field={field}
              index={index}
              moveField={moveField}
              onClick={() => setSelectedField(field)}
            />
          ) : null
        )
      ) : (
        <Typography variant="body1" color="text.secondary">
          Drag and drop fields here to build your form
        </Typography>
      )}
    </Box>
  );
};

export default FormCanvas;
