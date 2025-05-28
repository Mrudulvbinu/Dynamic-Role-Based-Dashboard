import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import FormFieldsList from './FormFieldsList';
import FormCanvas from './FormCanvas';
import FieldEditor from './FieldEditor';

const FormBuilder = () => {
  const [form, setForm] = useState({
    title: 'Untitled Form',
    description: '',
    fields: []
  });

  const [selectedField, setSelectedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      ...(type === 'dropdown' && { options: ['Option 1'] }),
      ...(type === 'checkbox' && { checked: false })
    };
    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (updatedField) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === updatedField.id ? updatedField : field
      )
    }));
  };

  const updateFields = (newFields) => {
    setForm(prev => ({
      ...prev,
      fields: newFields
    }));
  };

  const saveForm = () => {
    const savedForms = JSON.parse(localStorage.getItem('forms') || '[]');
    const formWithId = {
      ...form,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('forms', JSON.stringify([...savedForms, formWithId]));
    setShowSuccess(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 200px)' }}>
        <FormFieldsList addField={addField} />
        <FormCanvas
          fields={form.fields}
          setFields={updateFields}
          setSelectedField={setSelectedField}
        />
        <FieldEditor
          selectedField={selectedField}
          updateField={updateField}
        />
      </Box>

      <Button
        variant="contained"
        onClick={saveForm}
        sx={{ mt: 2 }}
      >
        Save Form
      </Button>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
    onClose={() => setShowSuccess(false)}
    severity="success"
    sx={{
      width: '450px',fontSize: '1.8rem',padding: '16px 24px',display: 'flex',alignItems: 'center'
    }}
    iconMapping={{
      success: <span style={{ fontSize: 40 }}>✅</span>
    }}
  >
          Form saved successfully!
        </Alert>
      </Snackbar>
    </DndProvider>
  );
};

export default FormBuilder;
