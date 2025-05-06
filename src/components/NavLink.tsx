"use client";

import { ComponentProps, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavLink = memo(({ className, ...props }: ComponentProps<typeof Link>) => {
  const path = usePathname();

  const isActive = path.startsWith(String(props.href));

  return (
    <Link
      {...props}
      className={cn(
        "transition-colors",
        isActive ? "text-foreground " : "text-muted-foreground hover:text-foreground ",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      role='link'
    />
  );
});

NavLink.displayName = "NavLink";

export default NavLink;
