import { TextField as MuiTextField } from '@mui/material';

const TextField = ({ field, control }) => {
  return (
    <Controller
      name={field.id}
      control={control}
      render={({ field: { onChange, value } }) => (
        <MuiTextField
          label={field.label}
          required={field.required}
          fullWidth
          margin="normal"
          value={value || ''}
          onChange={onChange}
        />
      )}
    />
  );
};

export default TextField;