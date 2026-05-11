import { Menu, X } from 'lucide-react';
import type { NextPage } from 'next';
import { type PropsWithChildren, useState } from 'react';
import styles from './navbar-menu-drawer.module.scss';

type Props = {
  title: string;
} & PropsWithChildren;

const NewNavbarMenuDrawer: NextPage<Props> = ({ title, children }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);

  return !showMenu ? (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => {
        setShowMenu(true);
        setMenu(true);
      }}
    >
      <Menu />
    </button>
  ) : (
    <div className={`${menu ? styles.menu : styles.menuClosing}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className={styles.title}>{title}</span>
          <button
            type="button"
            aria-label="Close menu"
            className={'cursor-pointer'}
            onClick={() => {
              setMenu(false);
              setTimeout(() => setShowMenu(false), 500);
            }}
          >
            <X />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default NewNavbarMenuDrawer;
