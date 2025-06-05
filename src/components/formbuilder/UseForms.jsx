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
import DynamicTable from "../DynamicTable";
import FormPreview from "./FormPreview";

const UseForms = ({ setActiveTab }) => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    setForms(savedForms);
  }, []);

  const handlePreview = (form) => {
    setSelectedForm(form);
    setOpenPreview(true);
  };

  const handleUseForm = (formId) => {
    const newWindow = window.open(`/form-fill/${formId}`, "_blank");
    if (newWindow) newWindow.focus();
  };

  const columns = [
    { key: "title", label: "Form Title" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = forms.map((form) => ({
    title: form.title,
    actions: (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handlePreview(form)}
        >
          Preview
        </Button>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleUseForm(form.id)}
        >
          Use
        </Button>
      </Stack>
    ),
  }));

  return (
    <Box sx={{ px: 3, py: 2 }}>
      {forms.length === 0 ? (
        <Typography>No forms available yet</Typography>
      ) : (
        <DynamicTable data={tableData} columns={columns} />
      )}

      {/* Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Form Preview</DialogTitle>
        <DialogContent>
          <div ref={printRef}>
            <FormPreview form={selectedForm} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UseForms;
