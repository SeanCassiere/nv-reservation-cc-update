import React from "react";
import cn from "classnames";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  image?: string;
};

export const cardTitleClassNames = cn("text-lg", "font-medium", "text-gray-600");
export const cardSubtitleClassNames = cn("text-sm", "text-gray-500");

const CardLayout: React.FC<Props> = ({ title, subtitle, image, children }) => {
  const cardClassNames = cn("w-full", "rounded", "border", "border-gray-100", "px-5", "py-5");

  return (
    <div className={cardClassNames}>
      {/* title */}
      {title && typeof title === "string" && <h1 className={cardTitleClassNames}>{title}</h1>}
      {title && typeof title === "number" && <h1 className={cardTitleClassNames}>{title}</h1>}
      {title && typeof title !== "string" && typeof title !== "number" && <React.Fragment>{title}</React.Fragment>}
      {/* subtitle */}
      {subtitle && typeof subtitle === "string" && <span className={cardSubtitleClassNames}>{subtitle}</span>}
      {subtitle && typeof subtitle === "number" && <span className={cardSubtitleClassNames}>{subtitle}</span>}
      {subtitle && typeof subtitle !== "string" && typeof subtitle !== "number" && (
        <React.Fragment>{subtitle}</React.Fragment>
      )}
      {/* image */}
      {image && (
        <div className="flex align-middle justify-center py-5">
          <img src={image} alt="" style={{ maxWidth: "70%" }} />
        </div>
      )}
      {/* body */}
      {children}
    </div>
  );
};

export default CardLayout;
