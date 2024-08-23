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
    <div
      ref={overlayRef}
      className={`${styles.overlay} fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}
      onClick={handleClose}
    >
      <div
        className={classNames(
          styles.content,
          className,
          "relative w-full max-w-lg rounded-md bg-white p-6 shadow-md",
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-xl font-bold text-black hover:text-red-500"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
