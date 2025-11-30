import { createTheme } from '@mui/material/styles'

const EMERALD = '#007F65' // oklch(59.6% 0.145 163.225) ≈ #007F65
const theme = createTheme({
  palette: {
    primary: {
      main: EMERALD,
      contrastText: '#fff'
    },
    mode: 'light'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#000',
          color: '#fff',
          '& input': {
            color: '#fff'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.12)'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.24)'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.36)'
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff'
          }
        }
      }
    }
  }
})

export default theme
