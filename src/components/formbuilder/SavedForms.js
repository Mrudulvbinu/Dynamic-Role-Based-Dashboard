import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText,
DialogActions } from '@mui/material';

const SavedForms = () => {
  const [forms, setForms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('forms')) || [];
    setForms(savedForms);
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedFormId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    const updatedForms = forms.filter(form => form.id !== selectedFormId);
    localStorage.setItem('forms', JSON.stringify(updatedForms));
    setForms(updatedForms);
    setOpenDialog(false);
    setSelectedFormId(null);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedFormId(null);
  };

  const FormCard = ({ form }) => (
    <Card>
      <CardContent>
        <Typography variant="h6">{form.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {form.fields.length} fields
        </Typography>
        {form.createdAt && (
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(form.createdAt).toLocaleString()}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small" color="error" onClick={() => handleDeleteClick(form.id)}>Delete</Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      {forms.length === 0 ? (
        <Typography>No forms saved yet</Typography>
      ) : (
        <Grid container spacing={3}>
          {forms.map(form => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <FormCard form={form} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this form? This action cannot be undone.
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
    </Box>
  );
};

export default SavedForms;
