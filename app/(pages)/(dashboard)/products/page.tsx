import { ChevronRight, Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarMenu } from "@/components/sidebar-menu";
import { Header } from "../../components/header";

export default function ProductsPage() {
  return (
    <div className="w-full h-full bg-muted">
      <Header
        links={[
          { label: "Dashboard", link: "/overview" },
          { label: "Products" },
        ]}
      />
      <div className="p-5">Products</div>
    </div>
  );
}
