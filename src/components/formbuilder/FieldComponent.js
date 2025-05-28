import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';


const FieldComponent = ({ field, index, moveField, onClick }) => {
  const ref = useRef(null);
  
  const [, drop] = useDrop({
    accept: 'field',
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveField(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { type: field.type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  FieldComponent.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
  moveField: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      onClick={onClick}
      sx={{
        p: 2,
        mb: 1,
        border: '1px solid #ddd',
        borderRadius: 1,
        backgroundColor: 'white',
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <Typography>{field.label}</Typography>
      <Typography variant="caption" color="text.secondary">
        {field.type}
      </Typography>
    </Box>
  );
};

export default FieldComponent;