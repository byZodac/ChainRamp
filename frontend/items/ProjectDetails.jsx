import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Divider,
  IconButton,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
}));

const ProjectDetailsDialog = ({ project, open, onClose, onJoinWhitelist }) => {
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const [page, setPage] = useState(1);
  const addressesPerPage = 10;

  const exportToCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + whitelistedAddresses.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${project.name}_whitelist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchWhitelistedAddresses = () => {
    // In a real application, you would fetch addresses from the contract here
    const mockAddresses = Array.from({ length: 100 }, (_, i) => `0x${i.toString(16).padStart(40, '0')}`);
    setWhitelistedAddresses(mockAddresses);
    setShowWhitelist(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedAddresses = whitelistedAddresses.slice(
    (page - 1) * addressesPerPage,
    page * addressesPerPage
  );

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        {showWhitelist ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setShowWhitelist(false)}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Whitelisted Addresses
            </Typography>
          </>
        ) : (
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {project.name}
          </Typography>
        )}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        {!showWhitelist ? (
          <>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Description</Typography>
              <Typography>{project.description}</Typography>
              <Typography>📍 Location: {project.location}</Typography>
              <Typography>🎟️ Whitelist Spots: {project.numAddressesWhitelisted} / {project.maxWhitelistedAddresses}</Typography>
            </StyledPaper>
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button variant="contained" color="primary" onClick={onJoinWhitelist}>
                Join Whitelist
              </Button>
              <Button variant="outlined" onClick={fetchWhitelistedAddresses}>
                View Whitelisted Addresses
              </Button>
            </Box>
          </>
        ) : (
          <>
            <List>
              {paginatedAddresses.map((address, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText primary={`${(page - 1) * addressesPerPage + index + 1}. ${address}`} />
                  </ListItem>
                  {index < paginatedAddresses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(whitelistedAddresses.length / addressesPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="secondary" onClick={exportToCSV}>
                Export to CSV
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default ProjectDetailsDialog;