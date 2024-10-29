import React, { type PropsWithChildren } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import styles from "./navbar.module.scss";
import NewNavbarMenuDrawer from "~/components/organisms/navbar/navbar-menu-drawer/navbar-menu-drawer";

type Props = {
  title: string;
} & PropsWithChildren;

const NewNavbar: React.FC<Props> = ({ title, children }) => {
  async function onLogoutClick() {
    if (typeof window !== "undefined") {
      await signOut();
      window.location.href = "/";
    }
  }

  return (
    <>
      <div className="hidden h-full border-r lg:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <span className="flex items-center gap-2 font-semibold">
              <span>{title}</span>
            </span>
          </div>

          <NavbarNavigation onLogoutClick={onLogoutClick}>
            {children}
          </NavbarNavigation>
        </div>
      </div>

      <div className={styles.menuDrawer}>
        <NewNavbarMenuDrawer title={title}>
          <NavbarNavigation onLogoutClick={onLogoutClick}>
            {children}
          </NavbarNavigation>
        </NewNavbarMenuDrawer>
      </div>
    </>
  );
};

type NavbarNavigationProps = {
  onLogoutClick: () => void;
} & PropsWithChildren;

const NavbarNavigation: React.FC<NavbarNavigationProps> = ({
  onLogoutClick,
  children,
}) => {
  return (
    <div className="flex flex-1 flex-col overflow-auto bg-white py-2">
      {children}
      <div
        className={`mt-auto flex cursor-pointer items-center gap-3 rounded-lg px-6 py-2 transition-all hover:text-gray-950`}
        onClick={onLogoutClick}
      >
        <LogOut /> Odjava
      </div>
    </div>
  );
};

export default NewNavbar;
