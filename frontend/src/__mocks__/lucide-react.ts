import React from 'react';

// Proxy-based stub: returns a named span for any lucide icon
const cache = new Map<string, React.FC>();

const handler: ProxyHandler<object> = {
  get(_target, prop) {
    if (typeof prop !== 'string') return undefined;
    if (prop === '__esModule' || prop === 'default') return module.exports;
    if (!cache.has(prop)) {
      const Icon: React.FC<{ className?: string; size?: number; color?: string }> = ({
        className,
      }) => React.createElement('span', { 'data-testid': `icon-${prop.toLowerCase()}`, className });
      Icon.displayName = prop;
      cache.set(prop, Icon);
    }
    return cache.get(prop);
  },
};

module.exports = new Proxy({}, handler);
