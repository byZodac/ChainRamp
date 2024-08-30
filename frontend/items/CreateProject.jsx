/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Select from "react-select";
import { countries } from "countries-list";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    padding: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: "8px 8px 0 0",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(1, 3),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .react-select__control": {
    minHeight: 56,
    borderColor: theme.palette.primary.light,
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  },
  "& .react-select__control--is-focused": {
    borderColor: `${theme.palette.primary.dark} !important`,
    boxShadow: `0 0 0 1px ${theme.palette.primary.dark}`,
  },
  "& .react-select__value-container": {
    padding: "2px 14px",
  },
  "& .react-select__placeholder": {
    color: theme.palette.text.secondary,
  },
  "& .react-select__menu": {
    zIndex: 2,
  },
}));

const FormField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const CreateProjectDialog = ({ open, onClose, onCreateProject }) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    location: null,
    maxWhitelistedAddresses: 0,
  });

  const countryOptions = useMemo(
    () =>
      Object.entries(countries)
        .map(([code, country]) => ({
          value: code,
          label: country.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    []
  );

  const handleCreate = () => {
    onCreateProject({
      ...newProject,
      location: newProject.location ? newProject.location.label : "",
    });
    // setNewProject({ name: '', description: '', location: null, maxWhitelistedAddresses: 0 });
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogTitle>
        <Typography variant="h5" component="div" fontWeight="bold">
          Create New Project
        </Typography>
      </StyledDialogTitle>
      <DialogContent>
        <Box my={2}>
          <FormField>
            <StyledTextField
              autoFocus
              label="Project Name"
              fullWidth
              variant="outlined"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
            />
          </FormField>
          <FormField>
            <StyledTextField
              label="Project Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
          </FormField>
          <FormField>
            <StyledSelect
              options={countryOptions}
              value={newProject.location}
              onChange={(selectedOption) =>
                setNewProject({ ...newProject, location: selectedOption })
              }
              placeholder="Select Country"
              classNamePrefix="react-select"
            />
          </FormField>
          <FormField>
            <StyledTextField
              label="Max Whitelist Spots"
              type="number"
              fullWidth
              variant="outlined"
              value={newProject.maxWhitelistedAddresses}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  maxWhitelistedAddresses: parseInt(e.target.value),
                })
              }
            />
          </FormField>
        </Box>
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="secondary" variant="outlined">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleCreate}
          color="primary"
          variant="contained"
        >
          Create Project
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default CreateProjectDialog;
