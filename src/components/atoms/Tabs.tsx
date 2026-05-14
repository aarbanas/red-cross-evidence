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
    const activeTab = tabs.find((tab) => pathname.includes(tab.link));
    return activeTab ? activeTab.link : tabs[0]!.link;
  });

  if (!tabs || tabs.length === 0) {
    return <div className="text-center text-gray-500">No tabs provided</div>;
  }

  return (
    <div className="w-full">
      <div className="flex gap-10 border-gray-200 border-b">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.link}
            onClick={() => {
              setActiveTab(tab.link);
              router.push(`${basePath}/${tab.link}`);
            }}
            className={cn(
              'cursor-pointer rounded-lg py-2 font-medium text-sm',
              'focus:outline-none focus:ring-1 focus:ring-red-600',
              activeTab === tab.link
                ? 'border-red px-1 text-red-600'
                : 'hover:bg-red-100',
            )}
            aria-selected={activeTab === tab.link}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
