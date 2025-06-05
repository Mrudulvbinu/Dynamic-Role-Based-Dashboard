import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { generatePDF } from "../formbuilder/PdfGenerator";
import FormPreview from "./FormPreview";
import { useParams } from "react-router-dom";

const FormFiller = () => {
  const [form, setForm] = useState(null);
  const printRef = useRef();
  const { id: formId } = useParams();

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem("forms")) || [];
    const selectedForm = savedForms.find((f) => f.id === formId);
    if (selectedForm) {
      setForm(selectedForm);
    }
  }, [formId]);

  const handleDownload = async () => {
    try {
      await generatePDF(printRef.current, form?.title);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleGoBack = () => {
    window.close();
  };

  if (!form) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Form not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#0059b3" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {form.title}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDownload}
          >
            Download Filled Form
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }} ref={printRef}>
        <FormPreview form={form} />
      </Box>
    </Box>
  );
};

export default FormFiller;
