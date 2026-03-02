import React, { useEffect, useState } from 'react';

export type KrIconName = 'leaf' | 'tram' | 'lotus' | 'wheat';

export interface KrIconProps {
  name: KrIconName;
  size?: number;
  className?: string;
  ariaLabel?: string;
  testId?: string;
}

export const KR_ICON_PATHS: Record<KrIconName, string> = {
  leaf: '/assets/kr-solidarity/ui-kit/svg/KR-ICON-001-leaf.svg',
  tram: '/assets/kr-solidarity/ui-kit/svg/KR-ICON-002-tram.svg',
  lotus: '/assets/kr-solidarity/ui-kit/svg/KR-ICON-003-lotus.svg',
  wheat: '/assets/kr-solidarity/ui-kit/svg/KR-ICON-004-wheat.svg',
};

const RAW_ICON_MODULES: Record<string, () => Promise<string>> =
  typeof import.meta.glob === 'function'
    ? (import.meta.glob('../../../public/assets/kr-solidarity/ui-kit/svg/KR-ICON-*.svg', {
        query: '?raw',
        import: 'default',
      }) as Record<string, () => Promise<string>>)
    : {};

const iconMarkupCache = new Map<KrIconName, string>();

const escapeAttribute = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const stripSvgRootAttributes = (attributes: string): string =>
  attributes.replace(
    /\s(?:width|height|focusable|role|aria-label|aria-hidden|class|style)=["'][^"']*["']/gi,
    '',
  );

const normalizeSvgMarkup = (markup: string): string => {
  const withoutMetadata = markup
    .replace(/<title[\s\S]*?<\/title>/gi, '')
    .replace(/<desc[\s\S]*?<\/desc>/gi, '');

  return withoutMetadata.replace(/<svg\b([^>]*)>/i, (_match, attributes) => {
    const cleanedAttributes = stripSvgRootAttributes(attributes);
    return `<svg${cleanedAttributes} width="100%" height="100%" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid meet">`;
  });
};

const getModuleKeyForIcon = (name: KrIconName): string | undefined => {
  const expectedFileName = KR_ICON_PATHS[name].split('/').pop();
  return Object.keys(RAW_ICON_MODULES).find((key) => key.endsWith(`/${expectedFileName}`));
};

export const resolveKrIconPath = (name: KrIconName): string => KR_ICON_PATHS[name];

export const loadKrIconMarkup = async (name: KrIconName): Promise<string> => {
  const cachedMarkup = iconMarkupCache.get(name);
  if (cachedMarkup) {
    return cachedMarkup;
  }

  const moduleKey = getModuleKeyForIcon(name);
  let rawMarkup = '';

  if (moduleKey) {
    rawMarkup = await RAW_ICON_MODULES[moduleKey]();
  } else {
    const response = await fetch(resolveKrIconPath(name));
    if (!response.ok) {
      throw new Error(`Unable to load Kerala Rage icon: ${name}`);
    }
    rawMarkup = await response.text();
  }

  const normalizedMarkup = normalizeSvgMarkup(rawMarkup);
  iconMarkupCache.set(name, normalizedMarkup);
  return normalizedMarkup;
};

export const KrIcon: React.FC<KrIconProps> = ({
  name,
  size = 24,
  className,
  ariaLabel,
  testId,
}) => {
  const [markup, setMarkup] = useState<string>('');
  const label = ariaLabel || name;

  useEffect(() => {
    let isActive = true;

    loadKrIconMarkup(name)
      .then((svgMarkup) => {
        if (isActive) {
          setMarkup(svgMarkup);
        }
      })
      .catch(() => {
        if (isActive) {
          setMarkup('');
        }
      });

    return () => {
      isActive = false;
    };
  }, [name]);

  const wrapperClassName = ['inline-flex shrink-0 leading-none', className].filter(Boolean).join(' ');
  const wrapperStyle: React.CSSProperties = {
    width: size,
    height: size,
  };
  const sharedProps = {
    'aria-label': escapeAttribute(label),
    'data-icon-path': resolveKrIconPath(name),
    'data-testid': testId,
    className: wrapperClassName,
    role: 'img',
    style: wrapperStyle,
  };

  if (!markup) {
    return (
      <span
        {...sharedProps}
        aria-busy="true"
      />
    );
  }

  return (
    <span
      {...sharedProps}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
};
