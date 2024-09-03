
import WhitelistProject from '../items/ChainRamp';
import Navbar from '../items/Navbar';
import Footer from '../items/Footer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
          <Navbar />
          <WhitelistProject />
          <Footer />
    </ThemeProvider>
  )
}

export default App

