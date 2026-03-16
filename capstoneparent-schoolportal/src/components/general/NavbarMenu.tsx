import type { ReactNode, RefObject } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface NavbarMenuItem {
  key: string;
  label: string;
  isActive?: boolean;
  type?: "link" | "dropdown";
  to?: string;
  href?: string;
  onClick?: () => void;
  dropdown?: ReactNode;
}

interface NavbarMenuProps {
  items: NavbarMenuItem[];
  navRef?: RefObject<HTMLElement | null>;
}

const getItemClasses = (isActive?: boolean, isButton?: boolean) =>
  cn(
    "text-gray-900 transition-colors hover:text-gray-700",
    isActive ? "text-xl font-bold" : "text-lg font-medium",
    isButton && "cursor-pointer border-0 bg-transparent p-0",
  );

export const NavbarMenu = ({ items, navRef }: NavbarMenuProps) => {
  return (
    <nav
      ref={navRef}
      className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-20 md:text-left"
    >
      {items.map((item) => {
        if (item.type === "dropdown") {
          return (
            <div key={item.key} className="relative">
              <button
                type="button"
                className={getItemClasses(item.isActive, true)}
                onClick={item.onClick}
              >
                {item.label}
              </button>
              {item.dropdown}
            </div>
          );
        }

        if (item.to) {
          return (
            <Link key={item.key} to={item.to} className={getItemClasses(item.isActive)}>
              {item.label}
            </Link>
          );
        }

        return (
          <a
            key={item.key}
            href={item.href}
            className={getItemClasses(item.isActive)}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};