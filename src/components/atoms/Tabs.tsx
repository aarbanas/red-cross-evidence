import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { type FC, useEffect, useState } from "react";
import { cn } from "~/components/utils";

type Props = {
  tabs: TabProp[];
};

export type TabProp = {
  label: string;
  queryParam: string;
  content: React.ReactNode;
};

const Tabs: FC<Props> = ({ tabs }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]!.queryParam);

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form

    if (activeTab === undefined) {
      current.delete("selected");
    } else {
      current.set("selected", activeTab.toString());
    }

    // cast to string
    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  }, [activeTab, pathname, router, searchParams]);

  if (!tabs || tabs.length === 0) {
    return <div className="text-center text-gray-500">No tabs provided</div>;
  }

  return (
    <div className="w-full">
      <div className="flex gap-10 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(tab.queryParam)}
            className={cn(
              "cursor-pointer py-2 text-sm font-medium",
              "focus:rounded focus:outline-none focus:ring-1 focus:ring-red-600",
              activeTab === tab.queryParam
                ? "border-red px-1 text-red-600"
                : "hover:bg-red-100",
            )}
            aria-selected={activeTab === tab.queryParam}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {
          tabs[tabs.findIndex(({ queryParam }) => queryParam === activeTab)]
            ?.content
        }
      </div>
    </div>
  );
};

export default Tabs;
