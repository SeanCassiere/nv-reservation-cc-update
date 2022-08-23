import React from "react";
import cn from "classnames";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  image?: string;
};

export const cardTitleClassNames = cn();
export const cardSubtitleClassNames = cn();

const CardLayout: React.FC<Props> = ({ title, subtitle, image, children }) => {
  const cardClassNames = cn("w-full", "rounded", "border", "border-gray-100", "px-3", "py-4");

  return (
    <div className={cardClassNames}>
      {/* title */}
      {title && typeof title === "string" && <h1 className={cardTitleClassNames}>{title}</h1>}
      {title && typeof title === "number" && <h1 className={cardTitleClassNames}>{title}</h1>}
      {title && typeof title === "function" && <React.Fragment>{title}</React.Fragment>}
      {/* subtitle */}
      {subtitle && typeof subtitle === "string" && <span className={cardSubtitleClassNames}>{subtitle}</span>}
      {subtitle && typeof subtitle === "number" && <span className={cardSubtitleClassNames}>{subtitle}</span>}
      {subtitle && typeof subtitle === "function" && <React.Fragment>{subtitle}</React.Fragment>}
      {/* image */}
      {image && (
        <div>
          <img src={image} alt="" />
        </div>
      )}
      {/* body */}
      {children}
    </div>
  );
};

export default CardLayout;
