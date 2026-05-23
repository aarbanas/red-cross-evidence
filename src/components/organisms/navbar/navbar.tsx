import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import NewNavbarMenuDrawer from '~/components/organisms/navbar/navbar-menu-drawer/navbar-menu-drawer';
import styles from './navbar.module.scss';

type Props = {
  title: string;
} & PropsWithChildren;

const NewNavbar: React.FC<Props> = ({ title, children }) => {
  async function onLogoutClick() {
    if (typeof window !== 'undefined') {
      await signOut();
      window.location.href = '/';
    }
  }

  return (
    <>
      <div className="hidden h-full border-r lg:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-15 items-center border-b px-6">
            <span className="flex items-center gap-2 font-semibold">
              <Image
                src="/red_cross.png"
                alt="Crveni Križ logo"
                width={28}
                height={28}
              />
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
    <div className="flex flex-1 flex-col overflow-auto bg-sidebar py-2">
      {children}
      <div className="mt-auto border-t p-2">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-2 transition-all hover:bg-sidebar-accent"
          onClick={onLogoutClick}
        >
          <LogOut /> Odjava
        </button>
      </div>
    </div>
  );
};

export default NewNavbar;
