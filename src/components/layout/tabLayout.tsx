import type { FC, PropsWithChildren } from "react";

const TabLayout: FC<Readonly<PropsWithChildren>> = ({ children }) => {
  return (
    <div className="flex flex-1 flex-col gap-4 pt-4 md:gap-8 md:pt-6">
      {children}
    </div>
  );
};

export default TabLayout;
