import type { ReactNode } from "react";

interface EmailLinkProps {
  email: string;
  children: ReactNode;
  className?: string;
}

export function EmailLink({ email, children, className }: EmailLinkProps) {
  return (
    <>
      <span
        className="hidden"
        dangerouslySetInnerHTML={{ __html: "<!--email_off-->" }}
        aria-hidden="true"
      />
      <a href={`mailto:${email}`} className={className}>
        {children}
      </a>
      <span
        className="hidden"
        dangerouslySetInnerHTML={{ __html: "<!--/email_off-->" }}
        aria-hidden="true"
      />
    </>
  );
}
