/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Pagination,
  useTheme,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import ProjectList from "./ProjectList";
import CreateProjectDialog from "./CreateProject";
import ProjectDetailsDialog from "./ProjectDetails";
import dev from "../src/assets/dev.jpg";
import { useWallet } from "../providers/WalletProvider";
import { moduleSchemaFromBase64 } from "@concordium/react-components";
import {
  ContractAddress,
  ReceiveName,
  AccountTransactionType,
  EntrypointName,
  Energy,
  CcdAmount,
  AccountAddress,
  SchemaVersion,
  ContractName,
  deserializeReceiveReturnValue,
} from "@concordium/web-sdk";
import {
  CONTRACT_NAME,
  MAX_CONTRACT_EXECUTION_ENERGY,
  VERIFIER_URL,
} from "../config";
import toast from "react-hot-toast";
import { Buffer } from "buffer/";
import { detectConcordiumProvider } from "@concordium/browser-wallet-api-helpers";
import { authorize, getChallenge } from "../utils";

// Mock data for testing
// const mockProjects = [
//   {
//     id: 1,
//     name: "Music NFT Platform",
//     description:
//       "Get on the whitelist to access exclusive music NFTs and support your favorite artists directly.",
//     location: "France",
//     maxWhitelistedAddresses: 100,
//     numAddressesWhitelisted: 80,
//   },
//   {
//     id: 2,
//     name: "Blockchain-Powered Charity",
//     description:
//       "Join the whitelist to contribute to and track donations through our blockchain-powered charity platform.",
//     location: "Brazil",
//     maxWhitelistedAddresses: 70,
//     numAddressesWhitelisted: 30,
//   },
//   {
//     id: 3,
//     name: "Crypto Art Collective",
//     description:
//       "Join the exclusive whitelist for early access to limited-edition NFT art collections from renowned digital artists.",
//     location: "UK",
//     maxWhitelistedAddresses: 150,
//     numAddressesWhitelisted: 60,
//   },
//   {
//     id: 4,
//     name: "DeFi Yield Optimizer",
//     description:
//       "Get whitelisted to participate in our next-gen DeFi platform, offering optimized yield farming strategies with minimal risk.",
//     location: "Germany",
//     maxWhitelistedAddresses: 200,
//     numAddressesWhitelisted: 100,
//   },
//   {
//     id: 5,
//     name: "Gaming Guild Beta Access",
//     description:
//       "Secure your spot on our whitelist to test out the latest play-to-earn games before they're released to the public.",
//     location: "South Korea",
//     maxWhitelistedAddresses: 75,
//     numAddressesWhitelisted: 50,
//   },
//   {
//     id: 6,
//     name: "Metaverse Real Estate Launch",
//     description:
//       "Join our whitelist to buy virtual land in the metaverse before the official public sale.",
//     location: "Australia",
//     maxWhitelistedAddresses: 300,
//     numAddressesWhitelisted: 250,
//   },
//   {
//     id: 7,
//     name: "Metaverse Real Estate Launch",
//     description:
//       "Join our whitelist to buy virtual land in the metaverse before the official public sale.",
//     location: "Australia",
//     maxWhitelistedAddresses: 300,
//     numAddressesWhitelisted: 250,
//   },
//   {
//     id: 8,
//     name: "Metaverse Real Estate Launch",
//     description:
//       "Join our whitelist to buy virtual land in the metaverse before the official public sale.",
//     location: "Australia",
//     maxWhitelistedAddresses: 300,
//     numAddressesWhitelisted: 250,
//   },
// ];
// Keyframe animation for the welcome text
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const WelcomeTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "4rem",
  color: theme.palette.primary.main,
  textTransform: "uppercase",
  letterSpacing: "0.1rem",
  marginBottom: theme.spacing(2),
  position: "relative",
  display: "inline-block",
  animation: `${fadeInUp} 1s ease-out`,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-10px",
    left: "0",
    width: "80px",
    height: "4px",
    backgroundColor: theme.palette.secondary.main,
  },
}));

const DescriptionTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  animation: `${fadeInUp} 1s ease-out 0.3s`,
  animationFillMode: "both",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontSize: "1.1rem",
  fontWeight: "bold",
  boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow:
      "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
  },
}));

const WhitelistProject = () => {
  const [projects, setProjects] = useState();
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const projectsPerPage = 6;
  const theme = useTheme();
  const { rpc, contract, connection, account } = useWallet();

  const getProject = async () => {
    toast.dismiss();
    const loading = toast.loading("Getting project...");
    try {
      if (contract) {
        const result = await rpc?.invokeContract({
          contract: contract && ContractAddress?.create(contract?.index, 0),
          method:
            contract &&
            ReceiveName?.create(
              contract?.name,
              EntrypointName?.fromString("get_all_projects")
            ),
          invoker: account && AccountAddress?.fromJSON(account),
        });
        console.log(result.returnValue);
        const buffer = Buffer?.from(result?.returnValue?.buffer).buffer;
        const contract_schema = await rpc?.getEmbeddedSchema(
          contract?.sourceModule
        );
        const newschema = Buffer?.from(contract_schema).buffer;

        console.log(newschema);
        const name = ContractName?.fromString(CONTRACT_NAME);
        const entry_point = EntrypointName?.fromString("get_all_projects");
        console.log(contract_schema);

        const values = await deserializeReceiveReturnValue(
          buffer,
          contract_schema,
          name,
          entry_point,
          SchemaVersion?.V1
        );
        console.log("values", values);
        setProjects(values);
        values &&
          toast.success("Fetched Projects", {
            id: loading,
          });
        return values;
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Error fetching projects", {
        id: loading,
      });
    }
  };

  useEffect(() => {
    if (rpc && contract && account) {
      getProject();
    }
  }, [rpc, contract, account]);

  const createProject = async (newProject) => {
    const loading = toast.loading("Creating campaign...");
    try {
      const schema = await rpc?.getEmbeddedSchema(contract?.sourceModule);

      // convert schema to base64……..
      const schemaToBase64 = btoa(
        new Uint8Array(schema).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // create params……..
      const params = {
        parameters: {
          name: newProject?.name,
          description: newProject?.description,
          location: "DK",
          max_whitelisted_addresses: newProject?.maxWhitelistedAddresses,
        },
        schema: moduleSchemaFromBase64(schemaToBase64),
      };

      const transaction = connection?.signAndSendTransaction(
        account,
        AccountTransactionType.Update,
        {
          amount: CcdAmount.fromCcd(0),
          address: ContractAddress.create(contract.index, 0),
          receiveName: ReceiveName.create(
            contract.name,
            EntrypointName.fromString("create_project")
          ),
          maxContractExecutionEnergy: Energy.create(
            MAX_CONTRACT_EXECUTION_ENERGY
          ),
        },
        params
      );
      toast.success("Campaign successfully created");
      transaction &&
        toast.success("Campaign successfully created", {
          id: loading,
        });
      return transaction;
    } catch (error) {
      toast.error("Error creating campaign", {
        id: loading,
      });
      console.error(error);
    }
  };

  // createProject2();

  const handleAuthorize = useCallback(
    async (location, projectId) => {
      try {
        const statement = [
          {
            type: "AttributeInSet",
            attributeTag: "nationality",
            set: [location],
          },
          // {
          //   type: "AttributeInRange",
          //   attributeTag: "dob",
          //   lower: lower,
          //   upper: upper,
          // },
        ];

        if (!account) {
          throw new Error("No account available");
        }

        const provider = await detectConcordiumProvider();
        const challenge = await getChallenge(VERIFIER_URL, account);
        const proof = await provider.requestIdProof(
          account,
          statement,
          challenge
        );

        const newAuthToken = await authorize(
          VERIFIER_URL,
          challenge,
          proof,
          statement
        );

        if (newAuthToken) {
          await joinWhitelist(projectId);
          console.log(newAuthToken);
        } else {
          toast.error("Failed to get authorization token");
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        toast.error("Authorization failed: " + error.message);
      }
    },
    [account]
  );

  const joinWhitelist = async (projectId) => {
    const loading = toast.loading("Joining Whitelist");

    try {
      const schema = await rpc?.getEmbeddedSchema(contract?.sourceModule);

      // convert schema to base64……..
      const schemaToBase64 = btoa(
        new Uint8Array(schema).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      // create params……..
      const params = {
        parameters: Number(projectId),
        schema: moduleSchemaFromBase64(schemaToBase64),
      };

      const transaction = await connection?.signAndSendTransaction(
        account,
        AccountTransactionType.Update,
        {
          amount: CcdAmount.fromCcd(0),
          address: ContractAddress.create(contract.index, 0),
          receiveName: ReceiveName.create(
            contract.name,
            EntrypointName.fromString("add_address_to_whitelist")
          ),
          maxContractExecutionEnergy: Energy.create(
            MAX_CONTRACT_EXECUTION_ENERGY
          ),
        },
        params
      );
      transaction &&
        toast.success("Successfully joined whitelist", {
          id: loading,
        });
      return transaction;
    } catch (error) {
      toast.error("Error joining whitelist", {
        id: loading,
      });
      console.error(error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastProject = page * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects?.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  return (
    <>
      {/* Welcome Section Container */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <WelcomeTypography variant="h2" component="h1">
              Gain Early Access!
            </WelcomeTypography>
            <DescriptionTypography variant="h5">
              Whitelist management protocol for gated onboarding on Concordium
              Blockchain.
            </DescriptionTypography>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create New Project
            </StyledButton>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 500,
                objectFit: "cover",
                borderRadius: 4,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
              alt="ChainRamp illustration"
              src={dev}
            />
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box
          sx={{
            mb: 4,
            borderBottom: `2px solid ${theme.palette.primary.main}`,
            display: "inline-block",
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Explore Projects
          </Typography>
          <DescriptionTypography variant="h6">
            Secure access into exciting projects on the Concordium Blockchain
            and get early entry rewards!
          </DescriptionTypography>
        </Box>
        <ProjectList
          projects={currentProjects}
          onProjectClick={setSelectedProject}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(projects?.length / projectsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="large"
          />
        </Box>
      </Container>

      <CreateProjectDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreateProject={createProject}
      />

      {selectedProject && (
        <ProjectDetailsDialog
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          project_id={selectedProject.project_id}
          // onJoinWhitelist={() => joinWhitelist(selectedProject.project_id)}
          onJoinWhitelist={() =>
            handleAuthorize(
              selectedProject.location,
              selectedProject.project_id
            )
          }
        />
      )}
    </>
  );
};

export default WhitelistProject;
