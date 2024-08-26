import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Box, Pagination, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import ProjectList from './ProjectList';
import CreateProjectDialog from './CreateProject';
import ProjectDetailsDialog from './ProjectDetails';
import dev from '../src/assets/dev.jpg';

// Mock data for testing
const mockProjects = [
  { id: 1, name: 'Music NFT Platform', description: 'Get on the whitelist to access exclusive music NFTs and support your favorite artists directly.', location: 'France', maxWhitelistedAddresses: 100, numAddressesWhitelisted: 80 },
  { id: 2, name: 'Blockchain-Powered Charity', description: 'Join the whitelist to contribute to and track donations through our blockchain-powered charity platform.', location: 'Brazil', maxWhitelistedAddresses: 70, numAddressesWhitelisted: 30 },
  { id: 3, name: 'Crypto Art Collective', description: 'Join the exclusive whitelist for early access to limited-edition NFT art collections from renowned digital artists.', location: 'UK', maxWhitelistedAddresses: 150, numAddressesWhitelisted: 60 },
  { id: 4, name: 'DeFi Yield Optimizer', description: 'Get whitelisted to participate in our next-gen DeFi platform, offering optimized yield farming strategies with minimal risk.', location: 'Germany', maxWhitelistedAddresses: 200, numAddressesWhitelisted: 100 },
  { id: 5, name: 'Gaming Guild Beta Access', description: "Secure your spot on our whitelist to test out the latest play-to-earn games before they're released to the public.", location: 'South Korea', maxWhitelistedAddresses: 75, numAddressesWhitelisted: 50 },
  { id: 6, name: 'Metaverse Real Estate Launch', description: 'Join our whitelist to buy virtual land in the metaverse before the official public sale.', location: 'Australia', maxWhitelistedAddresses: 300, numAddressesWhitelisted: 250 },
  { id: 7, name: 'Metaverse Real Estate Launch', description: 'Join our whitelist to buy virtual land in the metaverse before the official public sale.', location: 'Australia', maxWhitelistedAddresses: 300, numAddressesWhitelisted: 250 },
  { id: 8, name: 'Metaverse Real Estate Launch', description: 'Join our whitelist to buy virtual land in the metaverse before the official public sale.', location: 'Australia', maxWhitelistedAddresses: 300, numAddressesWhitelisted: 250 },
];
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
  fontWeight: 'bold',
  fontSize: '4rem',
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  letterSpacing: '0.1rem',
  marginBottom: theme.spacing(2),
  position: 'relative',
  display: 'inline-block',
  animation: `${fadeInUp} 1s ease-out`,
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '0',
    width: '80px',
    height: '4px',
    backgroundColor: theme.palette.secondary.main,
  },
}));

const DescriptionTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  animation: `${fadeInUp} 1s ease-out 0.3s`,
  animationFillMode: 'both',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontSize: '1.1rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
  },

}));


const WhitelistProject = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const projectsPerPage = 6;
  const theme = useTheme();

  useEffect(() => {
    // In a real application, you would fetch projects from the contract here
    // setProjects(fetchedProjects);
  }, []);

  const createProject = (newProject) => {
    // In a real application, you would call the contract method here
    setProjects([...projects, { ...newProject, id: projects.length + 1, numAddressesWhitelisted: 0 }]);
    setIsCreateDialogOpen(false);
  };

  const joinWhitelist = (projectId) => {
    // In a real application, you would call the contract method here
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { ...project, numAddressesWhitelisted: project.numAddressesWhitelisted + 1 }
        : project
    );
    setProjects(updatedProjects);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastProject = page * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

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
              Whitelist management protocol for gated onboarding on Concordium Blockchain.
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
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'cover',
                borderRadius: 4,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              alt="ChainRamp illustration"
              src={dev} 
            />
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ 
          mb: 4, 
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          display: 'inline-block'
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Explore Projects
          </Typography>
          <DescriptionTypography variant="h6">
            Secure access into exciting projects on the Concordium Blockchain and get early entry rewards!
          </DescriptionTypography>
        </Box>
        <ProjectList 
          projects={currentProjects} 
          onProjectClick={setSelectedProject} 
        />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={Math.ceil(projects.length / projectsPerPage)} 
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
          onJoinWhitelist={() => joinWhitelist(selectedProject.id)}
        />
      )}
    </>
  );
};

export default WhitelistProject;