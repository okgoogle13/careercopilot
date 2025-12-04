/**
 * ELECTRIC ALCHEMIST: DASHBOARD HEADER COMPONENT
 *
 * Header section for the dashboard with welcome message and quick actions.
 */

import React from 'react';
import { Bell, Plus, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components';
import { ElectricInput as Input } from '@/components/electric/input';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  userName?: string;
  unreadNotifications?: number;
  onSearch?: (query: string) => void;
  onNewDocument?: () => void;
  onViewProfile?: () => void;
  onViewNotifications?: () => void;
  onViewSettings?: () => void;
  className?: string;
}

export function DashboardHeader({
  userName = 'User',
  unreadNotifications = 0,
  onSearch = () => {},
  onNewDocument = () => {},
  onViewProfile = () => {},
  onViewNotifications = () => {},
  onViewSettings = () => {},
  className,
}: DashboardHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-10 bg-surface-container-highest shadow-sm', className)}>
      <div className="flex items-center justify-between p-4">
        {/* Left side - Welcome and search */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-2xl font-bold text-on-surface">Welcome back, {userName}!</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Here's what's happening with your applications today
          </p>
          
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <Input
              type="search"
              placeholder="Search applications, documents, and more..."
              className="pl-10 w-full max-w-xl"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onViewNotifications} className="relative p-2">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onViewSettings} className="p-2">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onViewProfile} className="p-2">
            <User className="h-5 w-5" />
          </Button>
          
          <Button onClick={onNewDocument} className="ml-2">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>
      
      {/* Stats bar */}
      <div className="bg-surface-container px-6 py-3 border-t border-outline-variant">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-on-surface-variant">Applications:</span>
            <span className="text-sm font-semibold text-primary">12</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-on-surface-variant">Interviews:</span>
            <span className="text-sm font-semibold text-secondary">3</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-on-surface-variant">Offers:</span>
            <span className="text-sm font-semibold text-tertiary">1</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
