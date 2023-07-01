import React from "react";
import clsx from "clsx";

type Props = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

const AnchorLink: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <a className={clsx("underline", className ? [...className.split(" ")] : undefined)} {...props}>
      {children}
    </a>
  );
};

export default AnchorLink;
