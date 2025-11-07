import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Badge, Avatar, IconButton, Card } from '@mui/material';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Logo } from './Logo';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Command,
  Sparkles,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: () => void;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  notificationCount?: number;
  showMobileMenu?: boolean;
  className?: string;
}

export function Navbar({
  onMenuToggle,
  onSearch,
  onProfileClick,
  onSettingsClick,
  notificationCount = 0,
  showMobileMenu = true,
  className = '',
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <nav
      className={`
      w-full h-16 
      bg-surface-card border-b border-subtle
      glass
      flex items-center justify-between px-4 lg:px-6
      transition-normal
      ${className}
    `}
    >
      {/* Left Section - Logo and Mobile Menu */}
      <div className="flex items-center gap-4">
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden h-9 w-9 p-0 hover:bg-muted focus-glow"
            aria-label="Toggle menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        <div className="flex items-center gap-3">
          <Logo size="sm" className="hover:scale-105 transition-normal" />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-content-primary">FML Career Copilot</h1>
            <p className="text-xs text-content-muted leading-tight">AI-Powered Career Growth</p>
          </div>
        </div>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents, templates, or career insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              pl-10 pr-12 h-9
              bg-muted border-border
              focus:border-primary focus:ring-2 focus:ring-primary/20
              placeholder:text-muted-foreground
              transition-normal
            "
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <kbd
              className="
              hidden sm:inline-flex h-5 select-none items-center gap-1 
              rounded border border-border bg-muted px-1.5 
              font-mono text-[10px] font-medium text-muted-foreground
            "
            >
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        </form>
      </div>

      {/* Right Section - Actions and Profile */}
      <div className="flex items-center gap-2">
        {/* Mobile Search Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
          className="md:hidden h-9 w-9 p-0 hover:bg-muted focus-glow"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* AI Assistant Badge */}
        <Badge
          variant="secondary"
          className="
            hidden lg:flex items-center gap-1 px-2 py-1
            bg-brand-purple/10 text-brand-purple border-brand-purple/20
            pulse-ai hover:bg-brand-purple/20 transition-normal
          "
        >
          <Sparkles className="h-3 w-3" />
          <span className="text-xs font-medium">Gemini AI</span>
        </Badge>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-muted relative focus-glow"
          aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount})` : ''}`}
        >
          <Bell className="h-4 w-4" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="
                absolute -top-1 -right-1 h-4 w-4 p-0 
                flex items-center justify-center text-xs
                pulse-new
              "
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </Badge>
          )}
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden lg:flex h-9 w-9 p-0 hover:bg-muted focus-glow"
          aria-label="Help"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="
                h-9 w-9 p-0 rounded-full 
                hover:bg-muted focus-glow
                ring-2 ring-transparent hover:ring-primary/20
                transition-normal
              "
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="
              w-56 glass border-border
              shadow-lg animate-in slide-in-from-top-2
            "
          >
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onProfileClick}
              className="hover:bg-muted cursor-pointer focus:bg-muted"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSettingsClick}
              className="hover:bg-muted cursor-pointer focus:bg-muted"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-muted cursor-pointer focus:bg-muted">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help & Support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-destructive/10 text-destructive cursor-pointer focus:bg-destructive/10 focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div
          className="
          absolute top-full left-0 right-0 z-50 
          bg-surface-card border-b border-border
          p-4 md:hidden
          glass
        "
        >
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents, templates, or career insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
}
