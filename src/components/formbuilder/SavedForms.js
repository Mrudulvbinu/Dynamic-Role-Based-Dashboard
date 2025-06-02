import React, { useState, useEffect } from "react";
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
  DialogActions,
} from "@mui/material";

import FormPreview from "./FormPreview";
import PrintableForm from "./PrintableForm";

const SavedForms = ({ setActiveTab }) => {
  const [forms, setForms] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);

  const [openLivePreview, setOpenLivePreview] = useState(false);
  const [openPrintablePreview, setOpenPrintablePreview] = useState(false);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const sanitizedForms = savedForms.map((form) => ({
      ...form,
      fields: Array.isArray(form.fields)
        ? form.fields.filter((field) => field && field.label)
        : [],
    }));
    setForms(sanitizedForms);
  }, []);

  const handleEdit = (formId) => {
    localStorage.setItem("formToEdit", formId);
    setActiveTab("formPlus");
  };

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
    setSelectedForm(form);
    setOpenLivePreview(true);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Print Form</title></head><body>"
    );
    printWindow.document.write(
      document.getElementById("printable-area").innerHTML
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const FormCard = ({ form }) => (
    <Card>
      <CardContent>
        <Typography variant="h5">{form.title}</Typography>
        <Typography variant="body1" color="text.secondary">
          {form.fields.length} fields
        </Typography>
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
          <Typography>
            Are you sure you want to delete this form? This action cannot be
            undone.
          </Typography>
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

      {/* Live Preview Dialog */}
      <Dialog
        open={openLivePreview}
        onClose={() => setOpenLivePreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Live Form Preview</DialogTitle>
        <DialogContent>
          <FormPreview form={selectedForm} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenLivePreview(false);
              setOpenPrintablePreview(true);
            }}
            color="primary"
            variant="outlined"
          >
            Print Form
          </Button>
          <Button onClick={() => setOpenLivePreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Printable Preview Dialog */}
      <Dialog
        open={openPrintablePreview}
        onClose={() => setOpenPrintablePreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Print Preview</DialogTitle>
        <DialogContent>
          <div id="printable-area">
            <PrintableForm form={selectedForm} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint} color="primary" variant="contained">
            Print Now
          </Button>
          <Button onClick={() => setOpenPrintablePreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedForms;
