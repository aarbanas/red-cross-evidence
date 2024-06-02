import { type PropsWithChildren, useState } from "react";
import { type NextPage } from "next";
import { Menu, X } from "lucide-react";
import styles from "./navbar-menu-drawer.module.scss";

type Props = {
  title: string;
} & PropsWithChildren;

const NewNavbarMenuDrawer: NextPage<Props> = ({ title, children }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);

  return !showMenu ? (
    <button
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
          <div
            className={"cursor-pointer"}
            onClick={() => {
              setMenu(false);
              setTimeout(() => setShowMenu(false), 500);
            }}
          >
            <X />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default NewNavbarMenuDrawer;
