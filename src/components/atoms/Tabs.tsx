import React, { type FC, useState } from "react";
import { cn } from "~/components/utils";

interface TabsProps {
  tabs?: {
    label: string;
    content: React.ReactNode;
  }[];
}

const Tabs: FC<TabsProps> = ({ tabs = [] }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return <div className="text-center text-gray-500">No tabs provided</div>;
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="flex gap-10 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              "focus:rounded focus:outline-none focus:ring-1 focus:ring-red-600",
              activeTab === index
                ? "border-red text-red-600"
                : "text-black hover:bg-red-100",
            )}
            aria-selected={activeTab === index}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default Tabs;
