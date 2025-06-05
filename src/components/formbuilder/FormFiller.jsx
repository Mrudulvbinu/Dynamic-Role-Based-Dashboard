import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { generatePDF } from "../formbuilder/PdfGenerator";
import FormPreview from "./FormPreview";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const FormFiller = () => {
  const [form, setForm] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const printRef = useRef();
  const { id: formId } = useParams();

  // Build validation schema based on form fields
  const buildValidationSchema = (fields) => {
    let schema = {};

    fields.forEach((field) => {
      if (field.type === "heading") return;

      let fieldSchema;

      switch (field.type) {
        case "text":
          fieldSchema = yup.string().required(`${field.label} is required`);
          break;
        case "date":
          fieldSchema = yup
            .date()
            .required(`${field.label} is required`)
            .typeError("Please enter a valid date");
          break;
        case "select":
          fieldSchema = yup.string().required(`${field.label} is required`);
          break;
        case "radio":
          fieldSchema = yup
            .string()
            .required(`Please select a ${field.label} option`);
          break;
        case "checkbox":
          fieldSchema = yup
            .array()
            .min(1, `Please select at least one ${field.label} option`);
          break;
        default:
          fieldSchema = yup.mixed();
      }

      schema[field.id] = fieldSchema;

      // Handle nested fields if they exist
      if (field.options) {
        field.options.forEach((option) => {
          if (option.nestedFields) {
            option.nestedFields.forEach((nestedField) => {
              const nestedFieldId = `${field.id}.nested.${nestedField.id}`;
              let nestedSchema;

              switch (nestedField.type) {
                case "text":
                  nestedSchema = yup.string().when(field.id, {
                    is: option.value,
                    then: yup
                      .string()
                      .required(`${nestedField.label} is required`),
                    otherwise: yup.string().notRequired(),
                  });
                  break;
                case "date":
                  nestedSchema = yup.date().when(field.id, {
                    is: option.value,
                    then: yup
                      .date()
                      .required(`${nestedField.label} is required`)
                      .typeError("Please enter a valid date"),
                    otherwise: yup.date().notRequired(),
                  });
                  break;
                case "select":
                case "radio":
                  nestedSchema = yup.string().when(field.id, {
                    is: option.value,
                    then: yup
                      .string()
                      .required(`${nestedField.label} is required`),
                    otherwise: yup.string().notRequired(),
                  });
                  break;
                case "checkbox":
                  nestedSchema = yup.array().when(field.id, {
                    is: option.value,
                    then: yup
                      .array()
                      .min(
                        1,
                        `Please select at least one ${nestedField.label} option`
                      ),
                    otherwise: yup.array().notRequired(),
                  });
                  break;
                default:
                  nestedSchema = yup.mixed();
              }

              schema[nestedFieldId] = nestedSchema;
            });
          }
        });
      }
    });

    return yup.object().shape(schema);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: form
      ? yupResolver(buildValidationSchema(form.fields))
      : undefined,
    mode: "onBlur",
  });

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

  const onSubmit = () => {
    setIsSubmitted(true);
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
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="md"
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        ref={printRef}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            maxWidth: "40rem",
            "& .MuiTextField-root, & .MuiFormControl-root, & .MuiInputBase-root":
              {
                width: "100%",
                maxWidth: "100%",
                my: 1,
              },
            "& .MuiInputBase-input, & .MuiOutlinedInput-input": {
              fontSize: "0.875rem",
              py: "0.75rem",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.875rem",
            },
            "& .MuiSelect-select": {
              py: "0.75rem",
            },
          }}
        >
          <FormPreview
            form={form}
            control={control}
            errors={errors}
            watch={watch}
          />

          {/* Dynamic submit/download button */}
          <Box
            sx={{
              mt: 4,
              width: "100%",
              maxWidth: "40rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color={isSubmitted ? "primary" : "success"}
              onClick={isSubmitted ? handleDownload : handleSubmit(onSubmit)}
              sx={{
                bgcolor: isSubmitted ? "#0059b3" : "#4caf50",
                "&:hover": {
                  bgcolor: isSubmitted ? "#003d82" : "#388e3c",
                },
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                width: "100%",
                maxWidth: "20rem",
              }}
              size="medium"
              type={isSubmitted ? "button" : "submit"}
            >
              {isSubmitted ? "Download Form" : "Submit"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default FormFiller;
