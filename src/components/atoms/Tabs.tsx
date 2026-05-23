import { usePathname, useRouter } from 'next/navigation';
import { type FC, useState } from 'react';
import { cn } from '~/components/utils';

type Props = {
  tabs: TabProp[];
  basePath: string;
};

export type TabProp = {
  label: string;
  link: string;
};

const Tabs: FC<Props> = ({ tabs, basePath }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(() => {
    const found = tabs.find((tab) => pathname.includes(tab.link));
    return found ? found.link : tabs[0]!.link;
  });

  if (!tabs || tabs.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No tabs provided</div>
    );
  }

  return (
    <div className="flex w-full gap-6 border-border border-b">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.link}
          onClick={() => {
            setActiveTab(tab.link);
            router.push(`${basePath}/${tab.link}`);
          }}
          className={cn(
            'relative inline-flex items-center justify-center whitespace-nowrap px-1 pb-3 font-medium text-sm transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:transition-colors',
            activeTab === tab.link
              ? 'font-semibold text-primary after:bg-primary'
              : 'text-muted-foreground after:bg-transparent hover:text-foreground',
          )}
          aria-selected={activeTab === tab.link}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
