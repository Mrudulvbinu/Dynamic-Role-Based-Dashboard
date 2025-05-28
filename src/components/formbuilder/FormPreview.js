import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const FormPreview = ({ fields }) => {
  const validationSchema = yup.object().shape(
    fields.reduce((schema, field) => {
      if (field.required) {
        schema[field.id] = yup.string().required(`${field.label} is required`);
      }
      return schema;
    }, {})
  );

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    // Save to localStorage or API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map(field => (
        <FieldComponent key={field.id} field={field} control={control} />
      ))}
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
};