import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Divider,
} from "@mui/material";

const SavedForms = ({ setActiveTab }) => {
  const [forms, setForms] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [previewForm, setPreviewForm] = useState(null);

  const printRef = useRef();

  const handleEdit = (formId) => {
    localStorage.setItem("formToEdit", formId);
    setActiveTab("formPlus");
  };

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const sanitizedForms = savedForms.map((form) => ({
      ...form,
      fields: Array.isArray(form.fields)
        ? form.fields.filter((field) => field && field.label)
        : [],
    }));
    console.log("Loaded sanitized forms:", sanitizedForms);
    setForms(sanitizedForms);
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedFormId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    const updatedForms = forms.filter((form) => form.id !== selectedFormId);
    localStorage.setItem("forms", JSON.stringify(updatedForms));
    setForms(updatedForms);
    setOpenDeleteDialog(false);
    setSelectedFormId(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setSelectedFormId(null);
  };

  const handlePreview = (form) => {
    setPreviewForm(form);
    setOpenPreviewDialog(true);
  };

  const handleClosePreview = () => {
    setPreviewForm(null);
    setOpenPreviewDialog(false);
  };

  const handlePrint = () => {
    const content = printRef.current;
    const pri = window.open("", "_blank");
    pri.document.write(`
      <html>
        <head>
          <title>Form Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .field-box { border: 1px solid #000; padding: 10px; margin-bottom: 10px; }
            h2, h4 { color: #2a2a2a; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    pri.document.close();
    pri.focus();
    pri.print();
    pri.close();
  };

  const FormCard = ({ form }) => (
    <Card>
      <CardContent>
        <Typography variant="h5">{form.title}</Typography>
        <Typography variant="body1" color="text.secondary">
          {form.fields.length} fields
        </Typography>
        {form.createdAt && (
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(form.createdAt).toLocaleString()}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="medium"
          color="success"
          onClick={() => handlePreview(form)}
        >
          Preview
        </Button>
        <Button size="medium" onClick={() => handleEdit(form.id)}>
          Edit
        </Button>
        <Button
          size="medium"
          color="error"
          onClick={() => handleDeleteClick(form.id)}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {forms.length === 0 ? (
        <Typography>No forms saved yet</Typography>
      ) : (
        <Grid container spacing={3}>
          {forms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <FormCard form={form} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this form? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Form Preview Dialog */}
      <Dialog
        open={openPreviewDialog}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Form Preview</DialogTitle>
        <DialogContent>
          <div ref={printRef}>
            {previewForm && (
              <Paper
                elevation={3}
                sx={{ padding: 3, mb: 2, border: "1px solid #ccc" }}
              >
                <Typography variant="h5" gutterBottom>
                  {previewForm.title}
                </Typography>
                {previewForm.description && (
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {previewForm.description}
                  </Typography>
                )}
                <Divider sx={{ mb: 2 }} />
                {previewForm.fields.map((field, idx) => {
                  if (!field || !field.label) return null; // Skip invalid fields
                  return (
                    <Box
                      key={idx}
                      className="field-box"
                      sx={{
                        border: "1px solid #333",
                        borderRadius: 1,
                        padding: 2,
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1">
                        <strong>{field.label}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Field Type: {field.type}
                      </Typography>
                    </Box>
                  );
                })}
              </Paper>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="primary" variant="outlined">
            Print to PDF
          </Button>
          <Button onClick={handleClosePreview}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedForms;
