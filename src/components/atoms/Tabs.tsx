import { useRouter } from "next/navigation";
import React, { type FC, useEffect, useState } from "react";
import { cn } from "~/components/utils";

type Props = {
  tabs: TabProp[];
};

export type TabProp = {
  label: string;
  link: string;
};

const Tabs: FC<Props> = ({ tabs }: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]!.link);

  useEffect(() => {
    router.push(`/educations/${activeTab}`);
  }, [activeTab, router]);

  if (!tabs || tabs.length === 0) {
    return <div className="text-center text-gray-500">No tabs provided</div>;
  }

  return (
    <div className="w-full">
      <div className="flex gap-10 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab.link)}
            className={cn(
              "cursor-pointer rounded-lg py-2 text-sm font-medium",
              "focus:outline-none focus:ring-1 focus:ring-red-600",
              activeTab === tab.link
                ? "border-red px-1 text-red-600"
                : "hover:bg-red-100",
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
