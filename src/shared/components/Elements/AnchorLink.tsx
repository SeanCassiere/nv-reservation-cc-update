import React from "react";
import cn from "classnames";

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {}

const AnchorLink: React.FC<Props> = ({ className, children, ...props }) => {
  const classNames = cn("underline", className ? [...className.split(" ")] : undefined);
  return (
    <a className={classNames} {...props}>
      {children}
    </a>
  );
};

export default AnchorLink;
