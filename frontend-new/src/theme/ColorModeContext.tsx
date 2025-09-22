import React from 'react';

interface ColorModeContextType {
  toggleColorMode: () => void;
}

export const ColorModeContext = React.createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

export const useColorMode = () => React.useContext(ColorModeContext);
