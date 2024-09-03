/* eslint-disable react/prop-types */
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  },
}));

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
});

const getColor = (name) => {
  const colors = ["#FFB3BA", "#BAFFC9", "#BAE1FF", "#FFFFBA", "#FFDFBA"];
  return colors[name.length % colors.length];
};

const ProjectList = ({ projects, onProjectClick }) => {
  return (
    <Grid container spacing={3}>
      {projects?.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.project_id}>
          <StyledCard
            onClick={() => onProjectClick(project)}
            sx={{ backgroundColor: getColor(project.name) }}
          >
            <CardContent>
              <BoldTypography variant="h5" component="div" gutterBottom>
                {project.name}
              </BoldTypography>
              <BoldTypography
                variant="body2"
                color="text.secondary"
                gutterBottom
              >
                {project.description}
              </BoldTypography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  📍{" "}
                  {project?.location?.map((item, index, array) => (
                    <span key={item.value}>
                      {item.label}
                      {index < array.length - 1 && ", "}
                    </span>
                  ))}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
              >
                <Typography variant="body2" color="text.secondary">
                  🎟️ Whitelist Spots:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Number(project.num_addresses_whitelisted)} /{" "}
                  {Number(project.max_whitelisted_addresses)}
                </Typography>
              </Box>
              <Box mt={1}>
                <Typography variant="body2" color="text.secondary">
                  {Number(project.max_whitelisted_addresses) -
                    Number(project.num_addresses_whitelisted) >
                  0
                    ? "✅"
                    : "❌"}
                  {Number(project.max_whitelisted_addresses) -
                    Number(project.num_addresses_whitelisted)}{" "}
                  spots remaining
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProjectList;
