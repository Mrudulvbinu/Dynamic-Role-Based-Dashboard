import { useState } from 'react';
import { Fab, Dialog, DialogTitle, List, ListItem, ListItemText, Checkbox } from '@mui/material';
import { Add } from '@mui/icons-material';

const WidgetSelector = ({ widgets, selectedWidgets, onToggleWidget }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Fab 
        color="primary" 
        onClick={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Add />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Widgets to be displayed</DialogTitle>
        <List>
          {widgets.map((widget) => (
            <ListItem 
              key={widget.id}
              onClick={() => onToggleWidget(widget.id)}
              sx={{ cursor: 'pointer' }} 
            >
              <Checkbox 
                checked={selectedWidgets.includes(widget.id)} 
                tabIndex={-1} 
                disableRipple
              />
              <ListItemText primary={widget.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
};

export default WidgetSelector;