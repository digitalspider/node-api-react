import {createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: { // bluish
      light: '#8889e2',
      main: '#2b2da0',
      dark: '#05064c',
      100: '#223344',
      navbar: 'lightpink',
      contrastText: '#ededf2',
    },
    secondary: { // greenish
      light: '#a9f2bb',
      main: '#1d7232',
      dark: '#32f262',
      contrastText: '#ededf2',
    },
  },
  typography: {
    fontFamily: 'Ariel',
    fontSize: 14,
  },
  overrides: {
    MuiCircularProgress: {
      root: {
        display: 'block',
        margin: '20px auto',
      },
    },
  },
});

export default theme;
