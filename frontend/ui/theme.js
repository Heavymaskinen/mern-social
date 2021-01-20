import { createMuiTheme } from '@material-ui/core/styles'
import { pink, blueGrey } from '@material-ui/core/colors'
const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#7c8fbe',
      main: '#76a4d0',
      dark: '#3d4c69',
      contrastText: '#070303',
    },
    secondary: {
      light: '#657bb1',
      main: '#4042c4',
      dark: '#253d53',
      contrastText: '#000',
    },
    openTitle: '#3b0202',
    protectedTitle: blueGrey['400'],
    type: 'light'
  }
})
export default theme