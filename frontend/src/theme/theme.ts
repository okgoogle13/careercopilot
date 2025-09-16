import { createTheme, ThemeOptions } from '@mui/material/styles';

const createSemanticPalette = (mode: 'light' | 'dark') => ({
  primary: {
    main: '#6366f1',
    light: '#8b5cf6',
    dark: '#4338ca',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#ec4899',
    light: '#f472b6',
    dark: '#be185d',
    contrastText: '#ffffff'
  },
  background: {
    default: mode === 'light' ? '#ffffff' : '#0f0f23',
    paper: mode === 'light' ? '#f8fafc' : '#1a1b3a'
  },
  text: {
    primary: mode === 'light' ? '#1e293b' : '#ffffff',
    secondary: mode === 'light' ? '#64748b' : '#a1a1aa'
  },
  divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.06)',
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626'
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706'
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669'
  }
});

export const createCareerCopilotTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...createSemanticPalette(mode)
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.025em'
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em'
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        fontWeight: 400
      },
      body2: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
        fontWeight: 400
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none'
      }
    },
    spacing: 8,
    shape: {
      borderRadius: 12
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: mode === 'light' ? '#64748b #f1f5f9' : '#475569 #1e293b',
            '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
              borderRadius: '8px',
              backgroundColor: mode === 'light' ? '#cbd5e1' : '#475569',
            },
            '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
              backgroundColor: mode === 'light' ? '#f8fafc' : '#1e293b',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            padding: '12px 24px',
            fontSize: '0.875rem',
            transition: 'all 0.2s ease-in-out'
          },
          contained: {
            background: mode === 'light'
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              background: mode === 'light'
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
            }
          },
          outlined: {
            borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.1)',
            color: mode === 'light' ? '#1e293b' : '#ffffff',
            '&:hover': {
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }
          },
          text: {
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.1)'
            }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1a1b3a',
            border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)'}`,
            borderRadius: '16px',
            boxShadow: mode === 'light'
              ? '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)'
              : '0 4px 12px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'rgba(99, 102, 241, 0.4)',
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light'
                ? '0 4px 12px rgba(99, 102, 241, 0.15)'
                : '0 8px 24px rgba(99, 102, 241, 0.2)'
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: mode === 'light' ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6366f1',
                borderWidth: '2px'
              }
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            fontWeight: 500
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'light' ? '#ffffff' : '#1a1b3a'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#0f0f23',
            color: mode === 'light' ? '#1e293b' : '#ffffff',
            boxShadow: mode === 'light'
              ? '0 1px 3px rgba(0, 0, 0, 0.1)'
              : '0 1px 3px rgba(0, 0, 0, 0.3)'
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '16px',
            backgroundColor: mode === 'light' ? '#ffffff' : '#1a1b3a'
          }
        }
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
            backgroundColor: mode === 'light' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)'
          },
          bar: {
            borderRadius: '4px'
          }
        }
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#6366f1',
            height: '3px',
            borderRadius: '2px'
          }
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&.Mui-selected': {
              color: '#6366f1'
            }
          }
        }
      }
    }
  });

export const lightTheme = createCareerCopilotTheme('light');
export const darkTheme = createCareerCopilotTheme('dark');

export default lightTheme;