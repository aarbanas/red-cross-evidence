import { type FC } from "react";
import styles from "./LoadingSpinner.module.css";

type LoadingSpinnerProps = {
  size?: number;
  color?: "#ffffff" | "#de3333";
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 32,
  color = "#de3333",
}) => {
  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{
          margin: "auto",
          display: "block",
          shapeRendering: "auto",
        }}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <g>
          <path
            d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843"
            fill="none"
            stroke={color}
            strokeWidth="12"
          />
          <path d="M49 3L49 27L61 15L49 3" fill={color} />
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          />
        </g>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
