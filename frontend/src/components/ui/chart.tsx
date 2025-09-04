'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { ChartSkeleton } from './ChartSkeleton';
import { ChartErrorBoundary } from './ChartErrorBoundary';

import { cn } from './utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  children: React.ReactElement;
  'aria-label'?: string;
  'aria-describedby'?: string;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  skeletonProps?: React.ComponentProps<typeof ChartSkeleton>;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  'aria-label': ariaLabel = 'Data Visualization',
  'aria-describedby': describedBy,
  isLoading,
  error,
  onRetry,
  skeletonProps,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  if (isLoading) {
    return <ChartSkeleton {...skeletonProps} />;
  }

  if (error) {
    return (
      <ChartErrorBoundary onRetry={onRetry}>
        <div style={{ display: 'none' }}>{children}</div>
      </ChartErrorBoundary>
    );
  }

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn('relative', className)}
        role='region'
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-busy={isLoading}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <div
          className='relative w-full'
          style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}
        >
          <div className='absolute inset-0'>
            <RechartsPrimitive.ResponsiveContainer width='100%' height='100%'>
              {children}
            </RechartsPrimitive.ResponsiveContainer>
          </div>
        </div>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipContentProps = Omit<RechartsPrimitive.TooltipProps<number, string>, 'content'> & {
  className?: string;
  indicator?: 'line' | 'dot' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelClassName?: string;
  nameKey?: string;
  labelKey?: string;
  color?: string;
  payload?: Array<{
    value: number;
    name: string;
    payload: any;
    dataKey: string;
    color: string;
    fill: string;
  }>;
  label?: string | number;
};

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  nameKey,
  labelKey,
  color,
  'aria-live': ariaLive = 'polite',
  'aria-atomic': ariaAtomic = true,
  ...props
}: ChartTooltipContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      role='tooltip'
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className={cn(
        'border-border/50 bg-background/95 backdrop-blur-sm grid min-w-[8rem] max-w-[90vw] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl sm:max-w-[80vw] md:max-w-[60vw]',
        className
      )}
      style={{
        transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
        willChange: 'transform, opacity',
      }}
      {...props}
    >
      {!nestLabel ? (
        <div className='font-medium' role='heading' aria-level={2}>
          {tooltipLabel}
        </div>
      ) : null}
      <div className='grid gap-1.5' role='list'>
        {(payload as any[]).map((item: any, index: number) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const indicatorColor = color || item.payload.fill || item.color;

          return (
            <div
              key={item.dataKey}
              className={cn(
                '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                indicator === 'dot' && 'items-center'
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                          {
                            'h-2.5 w-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent':
                              indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          }
                        )}
                        style={
                          {
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      'flex flex-1 justify-between leading-none',
                      nestLabel ? 'items-end' : 'items-center'
                    )}
                  >
                    <div className='grid gap-1.5'>
                      {nestLabel ? tooltipLabel : null}
                      <span className='text-muted-foreground'>
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className='text-foreground font-mono font-medium tabular-nums'>
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartLegend = RechartsPrimitive.Legend;

type ChartLegendContentProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> & {
  payload?: Array<{
    value: any;
    id: string;
    type?: string;
    color?: string;
    payload: {
      strokeDasharray?: string | number;
      value?: any;
      type?: string;
      fill?: string;
      stroke?: string;
      dataKey?: string;
      name?: string;
      color?: string;
    };
  }>;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  hideIcon?: boolean;
  nameKey?: string;
};

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
  'aria-label': ariaLabel = 'Chart Legend',
  ...props
}: ChartLegendContentProps & React.HTMLAttributes<HTMLDivElement>) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      role='listbox'
      aria-label={ariaLabel}
      className={cn('w-full overflow-x-auto py-2', className)}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--border) transparent',
      }}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex min-w-min items-center justify-start gap-4 px-4',
          verticalAlign === 'top' ? 'pb-1' : 'pt-1',
          'sm:justify-center'
        )}
      >
        {(payload || []).map((item: any) => {
          const key = `${nameKey || item.dataKey || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const color = item.color || item.fill || item.stroke;

          return (
            <button
              key={item.value}
              type='button'
              role='option'
              aria-selected='true'
              className={cn(
                'flex min-w-0 items-center gap-1.5 rounded px-2 py-1 transition-colors',
                'hover:bg-muted/50 active:bg-muted',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                'touch-manipulation select-none',
                '[&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0',
                'text-sm text-foreground/90'
              )}
              style={color ? ({ '--legend-color': color } as React.CSSProperties) : undefined}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className='h-2 w-2 shrink-0 rounded-[2px]'
                  style={{
                    backgroundColor: color,
                  }}
                />
              )}
              <span className='truncate'>{itemConfig?.label || item.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: any, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
