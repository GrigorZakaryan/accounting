import { SidebarMenu } from "@/components/sidebar-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";

export const Header = ({
  links,
}: {
  links: { link?: string; label: string }[];
}) => {
  return (
    <header className="w-full h-16 bg-white border-b">
      <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
        <ul className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
              <Button asChild variant={"link"} size={"icon-sm"}>
                <Menu className="mr-2 w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-primary">
                  Navigation Menu
                </SheetTitle>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4">
                <SidebarMenu />
              </div>
              <SheetFooter>
                <SheetClose asChild></SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <span className="lg:hidden">|</span>
          {links.map((link, idx) => {
            if (link.link) {
              return (
                <div className="flex items-center gap-2" key={idx}>
                  <Link href={link.link}>
                    <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                      {link.label}
                    </li>
                  </Link>
                  {links.length - 1 !== idx && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              );
            } else {
              return (
                <div key={idx}>
                  <li className="text-sm font-medium opacity-100">
                    {link.label}
                  </li>
                  {links.length - 1 !== idx && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              );
            }
          })}
        </ul>
      </div>
    </header>
  );
};
