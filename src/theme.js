import { createTheme } from '@mui/material/styles'

// Tema customizado MUI: modo dark com cor principal emerald e alto contraste

// Paleta de cores
const EMERALD = '#10B981'          // Cor principal (botões, ações primárias)
const SURFACE_1 = '#0f1724'        // Fundo escuro principal
const SURFACE_2 = '#1f2937'        // Fundo de cards/papers/inputs
const SURFACE_3 = '#334155'        // Bordas, divisores, estados hover
const TEXT_PRIMARY = '#F8FAFC'     // slate-50 - texto principal (máximo contraste)
const TEXT_SECONDARY = '#CBD5E1'   // slate-300 - texto secundário/muted
const TEXT_DISABLED = '#64748B'    // slate-500 - texto desabilitado

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: EMERALD,
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: EMERALD,
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF'
    },
    background: {
      default: SURFACE_1,
      paper: SURFACE_2
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
      disabled: TEXT_DISABLED
    },
    divider: SURFACE_3,
    action: {
      active: TEXT_PRIMARY,
      hover: SURFACE_3,
      selected: SURFACE_3,
      disabled: TEXT_DISABLED,
      disabledBackground: SURFACE_3
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      contrastText: '#FFFFFF'
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF'
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF'
    },
    success: {
      main: EMERALD,
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          color: '#F8FAFC',
          fontWeight: 500
        },
        contained: {
          backgroundColor: '#000000ff',
          fill: 'white',
          color: '#FFFFFF !important',
          '&:hover': {
            backgroundColor: '#000000ff',
            color: '#FFFFFF !important'
          }
        },
        text: {
          color: '#CBD5E1',
          '&:hover': {
            backgroundColor: SURFACE_3,
            color: '#F8FAFC'
          }
        },
        outlined: {
          borderColor: SURFACE_3,
          color: '#F8FAFC',
          '&:hover': {
            borderColor: '#CBD5E1',
            backgroundColor: SURFACE_3
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_2,
          color: TEXT_PRIMARY,
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_2,
          color: TEXT_PRIMARY,
          backgroundImage: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_2,
          color: '#F8FAFC',
          '& input': {
            color: '#F8FAFC',
            WebkitTextFillColor: '#F8FAFC'
          },
          '& textarea': {
            color: '#F8FAFC',
            WebkitTextFillColor: '#F8FAFC'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: SURFACE_3
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#CBD5E1'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: EMERALD
          }
        },
        input: {
          color: '#F8FAFC',
          WebkitTextFillColor: '#F8FAFC',
          '&::placeholder': {
            color: '#94A3B8',
            opacity: 1
          },
          '&[value]': {
            color: '#F8FAFC',
            WebkitTextFillColor: '#F8FAFC'
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#F8FAFC',
          '& input': {
            color: '#F8FAFC',
            WebkitTextFillColor: '#F8FAFC'
          },
          '& input[value]': {
            color: '#F8FAFC',
            WebkitTextFillColor: '#F8FAFC'
          }
        },
        input: {
          color: '#F8FAFC',
          WebkitTextFillColor: '#F8FAFC',
          '&[value]': {
            color: '#F8FAFC',
            WebkitTextFillColor: '#F8FAFC'
          },
          '&:-webkit-autofill': {
            WebkitTextFillColor: '#F8FAFC',
            WebkitBoxShadow: `0 0 0 1000px ${SURFACE_2} inset`,
            backgroundColor: SURFACE_2
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#CBD5E1 !important',
          '&.Mui-focused': {
            color: `${EMERALD} !important`
          },
          '&.Mui-disabled': {
            color: '#64748B !important'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: SURFACE_2,
            color: '#F8FAFC !important'
          },
          '& .MuiInputBase-input': {
            color: '#F8FAFC !important',
            WebkitTextFillColor: '#F8FAFC !important'
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#F8FAFC !important',
          '&:focus': {
            backgroundColor: SURFACE_2
          }
        },
        icon: {
          color: '#CBD5E1'
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: SURFACE_2,
          color: '#F8FAFC'
        },
        option: {
          color: '#F8FAFC !important',
          '&:hover': {
            backgroundColor: SURFACE_3
          },
          '&[aria-selected="true"]': {
            backgroundColor: SURFACE_3,
            color: '#F8FAFC !important'
          }
        },
        listbox: {
          backgroundColor: SURFACE_2,
          color: '#F8FAFC'
        },
        input: {
          color: '#F8FAFC !important'
        },
        tag: {
          backgroundColor: SURFACE_3,
          color: '#F8FAFC'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#F8FAFC !important',
          '&:hover': {
            backgroundColor: SURFACE_3
          },
          '&.Mui-selected': {
            backgroundColor: SURFACE_3,
            color: '#F8FAFC !important',
            '&:hover': {
              backgroundColor: SURFACE_3
            }
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#F8FAFC !important'
        },
        secondary: {
          color: '#CBD5E1 !important'
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_2,
          color: '#F8FAFC'
        },
        message: {
          color: '#F8FAFC'
        },
        icon: {
          color: '#F8FAFC'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: SURFACE_3,
          color: '#F8FAFC'
        },
        label: {
          color: '#F8FAFC'
        },
        deleteIcon: {
          color: '#CBD5E1',
          '&:hover': {
            color: '#F8FAFC'
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: '#94A3B8 !important',
          '&.Mui-error': {
            color: '#EF4444 !important'
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#CBD5E1 !important',
          '&.Mui-focused': {
            color: `${EMERALD} !important`
          },
          '&.Mui-error': {
            color: '#EF4444 !important'
          }
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: SURFACE_3
        }
      }
    }
  }
})

export default theme
