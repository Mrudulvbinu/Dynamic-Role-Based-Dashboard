import React from "react";
import { Typography } from "@mui/material";

const Label = ({
  text = "Static Label",
  align = "left",
  variant = "subtitle1",
}) => {
  return (
    <Typography variant={variant} align={align}>
      {text}
    </Typography>
  );
};

export default Label;
