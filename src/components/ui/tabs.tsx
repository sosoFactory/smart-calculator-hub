import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

// Tabs Context for variant & size inheritance
type TabsVariant = 'default' | 'dark-solid' | 'slate-solid';
type TabsSize = 'auto' | 'sm' | 'default' | 'lg';

interface TabsContextValue {
  variant?: TabsVariant;
  size?: TabsSize;
}

const TabsContext = React.createContext<TabsContextValue>({
  variant: 'default',
  size: 'default',
});

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-xl p-1 transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-slate-100/80 dark:bg-ghost-dark-surface-deep text-slate-500 dark:text-ghost-dark-ink-mute border border-slate-200/80 dark:border-ghost-dark-hairline',
        'dark-solid':
          'bg-slate-100 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline text-slate-600 dark:text-ghost-dark-ink-mute',
        'slate-solid':
          'bg-slate-100 dark:bg-ghost-dark-surface-deep border border-[#e5e7eb] dark:border-ghost-dark-hairline text-[#64748b] dark:text-ghost-dark-ink-mute',
      },
      size: {
        auto: 'h-auto',
        sm: 'h-8 text-xs',
        default: 'h-9 sm:h-10 text-xs sm:text-sm',
        lg: 'h-11 sm:h-12 text-sm sm:text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <TabsContext.Provider value={{ variant: variant || 'default', size: size || 'default' }}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  </TabsContext.Provider>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'text-slate-600 dark:text-ghost-dark-ink-mute hover:text-slate-900 dark:hover:text-ghost-dark-ink data-[state=active]:bg-white dark:data-[state=active]:bg-ghost-dark-surface-elevated data-[state=active]:text-[#112220] dark:data-[state=active]:text-slate-100 data-[state=active]:shadow-xs',
        'dark-solid':
          'text-[#475569] dark:text-ghost-dark-ink-mute hover:text-[#112220] dark:hover:text-white data-[state=active]:bg-[#15171a] dark:data-[state=active]:bg-white data-[state=active]:text-white dark:data-[state=active]:text-[#112220] data-[state=active]:shadow-sm',
        'slate-solid':
          'text-[#64748b] dark:text-ghost-dark-ink-mute hover:text-[#112220] dark:hover:text-white data-[state=active]:bg-[#15171a] dark:data-[state=active]:bg-ghost-dark-surface-elevated data-[state=active]:text-white dark:data-[state=active]:text-white data-[state=active]:shadow-2xs border border-transparent data-[state=active]:border-[#e5e7eb] dark:data-[state=active]:border-ghost-dark-hairline-soft',
      },
      size: {
        auto: 'px-3.5 py-2 text-xs gap-2',
        sm: 'px-2.5 py-1 text-xs gap-1.5',
        default: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2',
        lg: 'px-4 py-2 text-sm sm:text-base gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const resolvedVariant = variant || context.variant || 'default';
  const resolvedSize = size || context.size || 'default';

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        tabsTriggerVariants({ variant: resolvedVariant, size: resolvedSize }),
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19] focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
