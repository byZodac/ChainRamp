/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  ContractAddress,
  ReceiveName,
  EntrypointName,
  AccountAddress,
  SchemaVersion,
  ContractName,
  deserializeReceiveReturnValue,
  serializeUpdateContractParameters,
} from "@concordium/web-sdk";
import {
  Dialog,
  DialogTitle,
  DialogContent,
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
} from "@mui/material";
import { Buffer } from "buffer/";

import { CONTRACT_NAME } from "../config";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useWallet } from "../providers/WalletProvider";
import toast from "react-hot-toast";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "8px",
}));

const ProjectDetailsDialog = ({
  project,
  open,
  onClose,
  onJoinWhitelist,
  project_id,
}) => {
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);
  const [showWhitelist, setShowWhitelist] = useState(false);
  const [page, setPage] = useState(1);

  const { rpc, contract, account } = useWallet();

  const addressesPerPage = 10;

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," + whitelistedAddresses.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${project.name}_whitelist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWhiteList = async (projectId) => {
    const entry = "get_whitelisted_addresses";

    if (!rpc || !contract || !account) {
      console.warn(
        "Missing dependencies: rpc, contract, or account is undefined."
      );
      return;
    }

    try {
      const loadingId = toast.loading("Fetching whitelisted addresses...");
      const contractSchema = await rpc.getEmbeddedSchema(contract.sourceModule);
      if (!contractSchema) {
        throw new Error("Failed to fetch contract schema.");
      }

      toast.dismiss();

      // Serialize the projectId as a u64
      const serializedParameter = serializeUpdateContractParameters(
        ContractName.fromString("project_whitelist"),
        EntrypointName.fromString(entry),
        projectId,
        contractSchema,
        SchemaVersion.V1
      );

      const result = await rpc.invokeContract({
        contract: ContractAddress.create(contract.index, 0),
        method: ReceiveName.create(
          contract.name,
          EntrypointName.fromString(entry)
        ),
        invoker: AccountAddress.fromJSON(account),
        parameter: serializedParameter,
      });

      if (!result?.returnValue?.buffer) {
        throw new Error("Invalid return value from contract invocation.");
      }

      const buffer = Buffer.from(result.returnValue.buffer).buffer;
      const values = await deserializeReceiveReturnValue(
        buffer,
        contractSchema,
        ContractName.fromString(CONTRACT_NAME),
        EntrypointName.fromString(entry),
        SchemaVersion.V1
      );

      const whiteListedAddresses = values?.map((item) => item.Account[0]) || [];
      setWhitelistedAddresses(whiteListedAddresses);

      toast.success("Fetched Whitelisted Addresses", { id: loadingId });
      return values;
    } catch (error) {
      console.error("Error fetching whitelist:", error);
      // toast.error(`Error fetching whitelist: ${error.message}`, {
      //   id: loadingId,
      // });
    }
  };

  useEffect(() => {
    if (project?.creator?.Account[0] === account) {
      if (contract && Number.isInteger(Number(project_id))) {
        getWhiteList(Number(project_id));
      }
    }
  }, [contract, project_id]);

  console.log(project?.creator?.Account[0], account);

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
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              Whitelisted Addresses
            </Typography>
          </>
        ) : (
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
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
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Description
              </Typography>
              <Typography>{project.description}</Typography>
              <Typography>
                📍 Location:{" "}
                {project?.location?.map((item, index, array) => (
                  <span key={item.value}>
                    {item.label}
                    {index < array.length - 1 && ", "}
                  </span>
                ))}
              </Typography>
              <Typography>
                🎟️ Whitelist Spots: {Number(project.num_addresses_whitelisted)}{" "}
                / {Number(project.max_whitelisted_addresses)}
              </Typography>
            </StyledPaper>
            <Box display="flex" justifyContent="space-between" mt={2}>
              {project?.creator?.Account[0] !== account && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  onClick={onJoinWhitelist}
                >
                  Join Whitelist
                </Button>
              )}
              {project?.creator?.Account[0] === account && (
                <Button
                  variant="outlined"
                  fullWidth={true}
                  onClick={() => {
                    setShowWhitelist(true);
                  }}
                >
                  View Whitelisted Addresses
                </Button>
              )}
            </Box>
          </>
        ) : (
          <>
            <List>
              {paginatedAddresses.map((address, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`${
                        (page - 1) * addressesPerPage + index + 1
                      }. ${address}`}
                    />
                  </ListItem>
                  {index < paginatedAddresses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(
                  whitelistedAddresses.length / addressesPerPage
                )}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={exportToCSV}
              >
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
