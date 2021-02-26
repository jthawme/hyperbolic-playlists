import React from "react";
import Link from "next/link";

interface InternalExternalLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}

const InternalExternalLink: React.FC<InternalExternalLinkProps> = ({
  to,
  children,
  ...props
}) => {
  if (to.startsWith("http") || to.startsWith("mailto")) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={to} {...props}>
      {children}
    </Link>
  );
};

export { InternalExternalLink };
