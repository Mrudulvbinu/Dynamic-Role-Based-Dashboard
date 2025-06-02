import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Box } from "@mui/material";
import FieldComponent from "./FieldComponent";

const FormPreview = ({ fields }) => {
  const validationSchema = yup.object().shape(
    fields.reduce((schema, field) => {
      if (field.required) {
        schema[field.id] = yup.mixed().required(`${field.label} is required`);
      }
      return schema;
    }, {})
  );

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field) => (
          <Box key={field.id} sx={{ mb: 2 }}>
            <FieldComponent field={field} control={control} />
          </Box>
        ))}
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default FormPreview;
