import React, { type PropsWithChildren } from "react";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header
        className="sticky top-0 flex h-14 items-center gap-4 border-b px-10 lg:relative lg:h-[60px] lg:bg-gray-100/40 lg:px-6"
        style={{ zIndex: 1 }}
      >
        {children}
      </header>
    </>
  );
};

export default Header;
