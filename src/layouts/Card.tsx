import React from "react";
import clsx from "clsx";

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  image?: string;
};

const CardLayout: React.FC<Props> = ({ title, subtitle, image, children }) => {
  return (
    <div className={clsx("w-full", "rounded", "border", "border-gray-100", "px-5", "py-5")}>
      {/* title */}
      {title && typeof title === "string" && <CardTitleHeading>{title}</CardTitleHeading>}
      {title && typeof title === "number" && <CardTitleHeading>{title}</CardTitleHeading>}
      {title && typeof title !== "string" && typeof title !== "number" && <React.Fragment>{title}</React.Fragment>}
      {/* subtitle */}
      {subtitle && typeof subtitle === "string" && <CardSubtitleSpan>{subtitle}</CardSubtitleSpan>}
      {subtitle && typeof subtitle === "number" && <CardSubtitleSpan>{subtitle}</CardSubtitleSpan>}
      {subtitle && typeof subtitle !== "string" && typeof subtitle !== "number" && (
        <React.Fragment>{subtitle}</React.Fragment>
      )}
      {/* image */}
      {image && (
        <div className="flex justify-center py-5 align-middle">
          <img src={image} alt="" style={{ maxWidth: "70%" }} />
        </div>
      )}
      {/* body */}
      {children}
    </div>
  );
};

export const CardTitleHeading = React.forwardRef<HTMLHeadingElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <h1 ref={ref} className={clsx("text-2xl", "font-medium", "text-gray-600")}>
        {children}
      </h1>
    );
  }
);

export const CardSubtitleSpan = React.forwardRef<HTMLSpanElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    return (
      <span ref={ref} className={clsx("text-sm", "text-gray-500")}>
        {children}
      </span>
    );
  }
);

export default CardLayout;
