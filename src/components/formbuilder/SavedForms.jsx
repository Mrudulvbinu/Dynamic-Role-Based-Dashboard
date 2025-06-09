import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";

import PrintableForm from "./PrintableForm";
import DynamicTable from "../DynamicTable";

const SavedForms = ({ setActiveTab }) => {
  const [forms, setForms] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [openLivePreview, setOpenLivePreview] = useState(false);
  const printRef = useRef();

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

  const countTotalFields = (fields) => {
    let count = 0;
    fields.forEach((field) => {
      count++;
      if (field.options) {
        field.options.forEach((option) => {
          if (option.nestedFields && option.nestedFields.length > 0) {
            count += option.nestedFields.length;
          }
        });
      }
    });
    return count;
  };

  const columns = [
    { key: "title", label: "Form Title" },
    { key: "fieldsCount", label: "No. of Fields" },
    { key: "createdAt", label: "Created At" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = forms.map((form) => ({
    title: form.title,
    fieldsCount: countTotalFields(form.fields),
    createdAt: form.createdAt ? new Date(form.createdAt).toLocaleString() : "—",
    actions: (
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() => handlePreview(form)}
        >
          Preview
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleEdit(form.id)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeleteClick(form.id)}
        >
          Delete
        </Button>
      </Stack>
    ),
  }));

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {forms.length === 0 ? (
        <Typography>No forms saved yet</Typography>
      ) : (
        <DynamicTable data={tableData} columns={columns} />
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

      {/* Form Preview Dialog */}
      <Dialog
        open={openLivePreview}
        onClose={() => setOpenLivePreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Form Preview</DialogTitle>
        <DialogContent>
          <div ref={printRef}>
            {selectedForm && <PrintableForm form={selectedForm} />}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLivePreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedForms;
