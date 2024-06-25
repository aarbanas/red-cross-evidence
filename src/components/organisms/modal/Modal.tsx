import {
  type FC,
  type PropsWithChildren,
  type MouseEvent,
  useRef,
} from "react";
import styles from "./Modal.module.scss";
import { classNames } from "~/components/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  persistent?: boolean;
};

const Modal: FC<PropsWithChildren<Props>> = ({
  children,
  onClose,
  isOpen,
  className = "",
  persistent = false,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (overlayRef?.current === e.target && !persistent) {
      onClose();
    }
  };

  return (
    <div ref={overlayRef} className={styles.overlay} onClick={handleClose}>
      <div className={classNames(styles.content, className)}>{children}</div>
    </div>
  );
};

export default Modal;
