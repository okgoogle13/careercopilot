import toast from 'react-hot-toast';
import { apiClient } from '../../utils/apiClient';

export const useThemeSettings = (
  selectedTheme: string,
  setSelectedTheme: (theme: string) => void
) => {
  const handleThemeSelect = async (themeId: string) => {
    const previousTheme = selectedTheme;
    setSelectedTheme(themeId); // Optimistic update
    try {
      await apiClient.put('/settings/theme', { theme_id: themeId });
      toast.success('Theme preference saved!');
    } catch (error) {
      setSelectedTheme(previousTheme); // Rollback on error
      toast.error('Could not save theme preference.');
    }
  };

  return {
    handleThemeSelect,
  };
};
