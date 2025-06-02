import React from "react";
import GridLayout from "react-grid-layout";
import { Box, IconButton } from "@mui/material";
import TextField from "./fields/TextField";
import DropdownField from "./fields/DropdownField";
import CheckboxField from "./fields/CheckboxField";
import DateField from "./fields/DateField";
import RadioButton from "./fields/RadioButton";
import Label from "./fields/Label";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DeleteIcon from "@mui/icons-material/Delete";

const fieldComponentMap = {
  textfield: TextField,
  dropdown: DropdownField,
  checkbox: CheckboxField,
  date: DateField,
  radio: RadioButton,
  label: Label,
};

const FormCanvas = ({ fields, setFields, setSelectedField, deleteField }) => {
  const handleLayoutChange = (layout) => {
    const updatedFields = fields.map((field) => {
      const layoutItem = layout.find((item) => item.i === field.id);
      return {
        ...field,
        x: layoutItem?.x ?? 0,
        y: layoutItem?.y ?? 0,
        w: layoutItem?.w ?? 4,
        h: layoutItem?.h ?? 1,
      };
    });
    setFields(updatedFields);
  };

  return (
    <Box sx={{ flex: 1, p: 2, border: "1px solid #ccc", minHeight: "400px" }}>
      <GridLayout
        className="layout"
        layout={fields
          .filter((f) => f && f.id)
          .map((f) => ({
            i: f.id,
            x: f.x ?? 0,
            y: typeof f.y === "number" ? f.y : 0,
            w: f.w ?? 4,
            h: f.h ?? 1,
          }))}
        cols={12}
        rowHeight={60}
        width={800}
        isDraggable
        isResizable
        onLayoutChange={handleLayoutChange}
      >
        {fields
          .filter((field) => field && field.id)
          .map((field) => {
            const Component = fieldComponentMap[field.type];
            if (!Component) return null;
            return (
              <div
                key={field.id}
                onClick={() => setSelectedField(field)}
                style={{ position: "relative" }}
              >
                <Component field={field} />
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent select on delete
                    deleteField(field.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            );
          })}
      </GridLayout>
    </Box>
  );
};

export default FormCanvas;
