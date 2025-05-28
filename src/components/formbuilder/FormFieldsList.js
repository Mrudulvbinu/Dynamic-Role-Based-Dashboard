import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useDrag } from 'react-dnd';

const fieldTypes = [
  { type: 'text', label: 'Text Field' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'date', label: 'Date Picker' },
  { type: 'checkbox', label: 'Checkbox' }
];

const DraggableField = ({ type, label, addField }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { type },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        addField(item.type);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <Button
      ref={drag}
      variant="outlined"
      fullWidth
      sx={{ mb: 1, opacity: isDragging ? 0.5 : 1 }}
    >
      {label}
    </Button>
  );
};

const FormFieldsList = ({ addField }) => {
  return (
    <Box sx={{ width: 200, p: 2, borderRight: '1px solid #eee' }}>
      <Typography variant="h6">Fields</Typography>
      {fieldTypes.map((field) => (
        <DraggableField
          key={field.type}
          type={field.type}
          label={field.label}
          addField={addField}
        />
      ))}
    </Box>
  );
};

export default FormFieldsList;