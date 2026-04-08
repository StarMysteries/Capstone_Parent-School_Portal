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
  isMobile?: boolean;
}

const getItemClasses = (isActive?: boolean, isButton?: boolean, isMobile?: boolean) =>
  cn(
    "text-gray-900 transition-colors hover:text-gray-700",
    isActive ? "font-bold" : "font-medium",
    isMobile ? "text-xl py-3 leading-tight" : "text-lg",
    isButton && "cursor-pointer border-0 bg-transparent p-0",
  );

export const NavbarMenu = ({ items, navRef, isMobile = false }: NavbarMenuProps) => {
  return (
    <nav
      ref={navRef}
      className={cn(
        "flex items-center gap-4 text-center",
        isMobile ? "flex-col w-full items-start gap-5 text-left" : "md:flex-row md:gap-20 md:text-left"
      )}
    >
      {items.map((item) => {
        if (item.type === "dropdown") {
          return (
            <div key={item.key} className={cn("relative", isMobile && "w-full") }>
              <button
                type="button"
                className={cn(
                  getItemClasses(item.isActive, true, isMobile),
                  isMobile && "block w-full text-left rounded-md px-1",
                )}
                onClick={item.onClick}
              >
                {item.label}
              </button>
              {item.dropdown && (
                <div className={isMobile ? "mt-2 w-full pl-3" : ""}>
                  {item.key === "about" && isMobile ? (
                    <div className="w-full">
                      {item.dropdown}
                    </div>
                  ) : (
                    item.dropdown
                  )}
                </div>
              )}
            </div>
          );
        }

        if (item.to) {
          return (
            <Link 
              key={item.key} 
              to={item.to} 
              className={cn(
                getItemClasses(item.isActive, false, isMobile),
                isMobile && "w-full block text-left rounded-md px-1",
              )}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <a
            key={item.key}
            href={item.href}
            className={cn(
              getItemClasses(item.isActive, false, isMobile),
              isMobile && "w-full block text-left rounded-md px-1",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
};