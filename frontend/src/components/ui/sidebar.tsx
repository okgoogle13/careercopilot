import React, { useState, createContext, useContext } from 'react';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
  children?: SidebarItem[];
  disabled?: boolean;
}

export interface SidebarSection {
  id: string;
  title?: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Main Sidebar Component
export interface SidebarProps {
  sections: SidebarSection[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showToggle?: boolean;
  width?: number;
  collapsedWidth?: number;
}

export function Sidebar({
  sections,
  collapsed = false,
  onCollapsedChange,
  mobile = false,
  open = true,
  onOpenChange,
  className,
  header,
  footer,
  showToggle = true,
  width = 280,
  collapsedWidth = 60,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);
  const [internalOpen, setInternalOpen] = useState(open);

  const isCollapsed = onCollapsedChange ? collapsed : internalCollapsed;
  const isOpen = onOpenChange ? open : internalOpen;

  const handleCollapsedChange = (newCollapsed: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const contextValue: SidebarContextType = {
    collapsed: isCollapsed,
    setCollapsed: handleCollapsedChange,
    mobile,
    open: isOpen,
    setOpen: handleOpenChange,
  };

  const sidebarWidth = isCollapsed ? collapsedWidth : width;

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Mobile Overlay */}
      {mobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => handleOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-200',
          mobile && 'lg:relative lg:translate-x-0',
          mobile && !isOpen && '-translate-x-full',
          mobile && isOpen && 'translate-x-0',
          !mobile && 'relative',
          className
        )}
        style={{ width: sidebarWidth }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          {header && (
            <div className={cn(
              'p-4 border-b border-border',
              isCollapsed && 'px-2'
            )}>
              {header}
            </div>
          )}

          {/* Toggle Button */}
          {showToggle && !mobile && (
            <div className={cn(
              'flex justify-end p-2 border-b border-border',
              isCollapsed && 'justify-center'
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCollapsedChange(!isCollapsed)}
                className="h-8 w-8 p-0"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {/* Mobile Close Button */}
          {mobile && (
            <div className="flex justify-between items-center p-4 border-b border-border lg:hidden">
              <span className="font-medium">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Content */}
          <ScrollArea className="flex-1">
            <nav className="p-2">
              {sections.map((section, index) => (
                <SidebarSection key={section.id} section={section} />
              ))}
            </nav>
          </ScrollArea>

          {/* Footer */}
          {footer && (
            <div className={cn(
              'p-4 border-t border-border',
              isCollapsed && 'px-2'
            )}>
              {footer}
            </div>
          )}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}

// Sidebar Section Component
interface SidebarSectionProps {
  section: SidebarSection;
}

function SidebarSection({ section }: SidebarSectionProps) {
  const { collapsed } = useSidebar();
  const [expanded, setExpanded] = useState(section.defaultExpanded ?? true);

  return (
    <div className="mb-4">
      {/* Section Title */}
      {section.title && !collapsed && (
        <div className="px-3 mb-2">
          {section.collapsible ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <span>{section.title}</span>
              <ChevronRight className={cn(
                "h-3 w-3 transition-transform",
                expanded && "rotate-90"
              )} />
            </button>
          ) : (
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
          )}
        </div>
      )}

      {/* Section Items */}
      {(expanded || collapsed) && (
        <div className="space-y-1">
          {section.items.map((item) => (
            <SidebarItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// Sidebar Item Component
interface SidebarItemProps {
  item: SidebarItem;
  level?: number;
}

function SidebarItem({ item, level = 0 }: SidebarItemProps) {
  const { collapsed, mobile, setOpen } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = collapsed ? 0 : level * 12;

  const handleClick = () => {
    if (item.disabled) return;

    if (hasChildren && !collapsed) {
      setExpanded(!expanded);
    } else if (item.onClick) {
      item.onClick();
      if (mobile) {
        setOpen(false);
      }
    }
  };

  const ItemContent = () => (
    <>
      {/* Icon */}
      {item.icon && (
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {item.icon}
        </div>
      )}

      {/* Label and Badge */}
      {!collapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="truncate">{item.label}</span>
          <div className="flex items-center gap-2">
            {item.badge && (
              <span className="bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full font-medium">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronRight className={cn(
                "h-3 w-3 transition-transform",
                expanded && "rotate-90"
              )} />
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div>
      {item.href ? (
        <a
          href={item.href}
          onClick={(e) => {
            if (item.onClick) {
              e.preventDefault();
              handleClick();
            }
            if (mobile) {
              setOpen(false);
            }
          }}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground focus:outline-none',
            item.active && 'bg-accent text-accent-foreground font-medium',
            item.disabled && 'pointer-events-none opacity-50',
            collapsed && 'justify-center px-2'
          )}
          style={{ paddingLeft: collapsed ? undefined : `${12 + paddingLeft}px` }}
        >
          <ItemContent />
        </a>
      ) : (
        <button
          onClick={handleClick}
          disabled={item.disabled}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all text-left',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:bg-accent focus:text-accent-foreground focus:outline-none',
            'disabled:pointer-events-none disabled:opacity-50',
            item.active && 'bg-accent text-accent-foreground font-medium',
            collapsed && 'justify-center px-2'
          )}
          style={{ paddingLeft: collapsed ? undefined : `${12 + paddingLeft}px` }}
        >
          <ItemContent />
        </button>
      )}

      {/* Children */}
      {hasChildren && !collapsed && expanded && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && item.icon && (
        <div className="sr-only">{item.label}</div>
      )}
    </div>
  );
}

// Mobile Sidebar Trigger
export function SidebarTrigger({ className, ...props }: React.ComponentProps<'button'>) {
  const sidebar = useSidebar();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('lg:hidden', className)}
      onClick={() => sidebar.setOpen(true)}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

// Hook to use sidebar context
export { useSidebar };

// Sidebar with responsive behavior
interface ResponsiveSidebarProps extends Omit<SidebarProps, 'mobile' | 'open' | 'onOpenChange'> {
  breakpoint?: number; // px
}

export function ResponsiveSidebar({ 
  breakpoint = 1024, 
  ...props 
}: ResponsiveSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return (
    <Sidebar
      {...props}
      mobile={isMobile}
      open={open}
      onOpenChange={setOpen}
    />
  );
}