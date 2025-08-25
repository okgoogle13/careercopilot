import React from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <main>{children}</main>
    </div>
  );
};
