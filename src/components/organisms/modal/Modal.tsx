import { type FC, type MouseEvent, type PropsWithChildren, useRef } from 'react'
import { classNames } from '~/components/utils'
import styles from './Modal.module.css'

type Props = {
  isOpen: boolean
  onClose: () => void
  className?: string
  persistent?: boolean
}

const Modal: FC<PropsWithChildren<Props>> = ({
  children,
  onClose,
  isOpen,
  className = '',
  persistent = false,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  if (!isOpen) {
    return null
  }

  const handleClose = (e: MouseEvent<HTMLDivElement>) => {
    if (overlayRef?.current === e.target && !persistent) {
      onClose()
    }
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop closes on click by design
    <div
      ref={overlayRef}
      className={`${styles.overlay} bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black`}
      onClick={handleClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        className={classNames(
          styles.content,
          className,
          'relative w-full max-w-lg rounded-md bg-white p-6 shadow-md',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-black hover:text-red-500"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal
