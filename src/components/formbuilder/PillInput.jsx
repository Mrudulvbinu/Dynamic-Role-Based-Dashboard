import { useState, useEffect, useRef } from "react";
import { Box, Chip, TextField, IconButton, Stack, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const PillInput = ({ options, onChange }) => {
  const [inputValues, setInputValues] = useState(
    options.map((opt) => opt.label)
  );
  const [currentInput, setCurrentInput] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    setInputValues(options.map((opt) => opt.label));
  }, [options]);

  const handleAddOption = () => {
    if (currentInput.trim()) {
      const newOptions = [
        ...options,
        {
          label: currentInput.trim(),
          value: currentInput.trim().toLowerCase().replace(/\s+/g, "_"),
          nestedFields: [],
        },
      ];
      onChange(newOptions);
      setCurrentInput("");
      setFocusedIndex(null);
    }
  };

  const handleUpdateOption = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);

    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      label: value.trim(),
      value: value.trim().toLowerCase().replace(/\s+/g, "_"),
    };
    onChange(newOptions);
  };

  const handleDeleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    onChange(newOptions);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      if (index === options.length - 1) {
        handleAddOption();
      } else {
        setFocusedIndex(index + 1);
      }
    } else if (e.key === "Backspace" && inputValues[index] === "") {
      handleDeleteOption(index);
      setFocusedIndex(Math.max(0, index - 1));
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 1, backgroundColor: "transparent" }}>
      <Stack direction="column" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        {options.map((option, index) => (
          <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              label={
                focusedIndex === index ? (
                  <TextField
                    autoFocus
                    variant="standard"
                    size="small"
                    value={inputValues[index]}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onBlur={() => setFocusedIndex(null)}
                    sx={{
                      width: "100px",
                      "& .MuiInputBase-root": {
                        height: "32px",
                      },
                    }}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                  />
                ) : (
                  option.label
                )
              }
              onClick={() => {
                setFocusedIndex(index);
                setTimeout(() => {
                  inputRefs.current[index]?.focus();
                }, 0);
              }}
              onDelete={() => handleDeleteOption(index)}
              sx={{
                height: "32px",
                borderRadius: "16px",
                backgroundColor:
                  focusedIndex === index ? "transparent" : "default",
                "& .MuiChip-label": {
                  padding: focusedIndex === index ? 0 : "0 12px",
                },
              }}
            />
          </Box>
        ))}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            variant="standard"
            size="small"
            placeholder="Add option"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddOption();
              }
            }}
            sx={{
              width: "100px",
              "& .MuiInputBase-root": {
                height: "32px",
              },
            }}
          />
          <IconButton
            size="small"
            onClick={handleAddOption}
            disabled={!currentInput.trim()}
            sx={{ ml: 0.5 }}
          >
            <AddCircleIcon
              color={currentInput.trim() ? "primary" : "disabled"}
            />
          </IconButton>
        </Box>
      </Stack>
    </Paper>
  );
};

export default PillInput;
