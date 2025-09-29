import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  useTheme,
  alpha,
} from '@mui/material';
import { NavItem } from '../../config/navigation';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface NavigationItemProps {
  item: NavItem;
  depth?: number;
  onItemClick?: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ item, depth = 0, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const isActive =
    location.pathname === item.path ||
    (item.children?.some((child) => location.pathname.startsWith(child.path)) ?? false);

  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else {
      navigate(item.path);
      onItemClick?.();
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: 2 + depth * 2,
          py: 1,
          borderRadius: 1,
          marginBottom: 0.5,
          bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          },
          '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
            },
          },
        }}
        selected={isActive}
      >
        <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'primary.main' : 'text.secondary' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'primary.main' : 'text.primary',
          }}
        />
        {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child, index) => (
              <NavigationItem
                key={index}
                item={child}
                depth={depth + 1}
                onItemClick={onItemClick}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};
