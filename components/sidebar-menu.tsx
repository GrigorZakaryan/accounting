"use client";
import { useNavigation } from "@/stores/sidebar";
import {
  ArrowLeftRight,
  DollarSign,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCartIcon,
  Tag,
} from "lucide-react";
import { redirect, usePathname } from "next/navigation";

const menu = [
  {
    name: "Overview",
    icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
    link: "/",
  },
  {
    name: "Transactions",
    icon: <ArrowLeftRight className="w-5 h-5 text-primary" />,
    link: "/transactions",
  },
  {
    name: "Purchases",
    icon: <ShoppingCartIcon className="w-5 h-5 text-primary" />,
    link: "/purchases",
  },
  {
    name: "Sales",
    icon: <Tag className="w-5 h-5 text-primary" />,
    link: "/sales",
  },
  {
    name: "Products",
    icon: <Package className="w-5 h-5 text-primary" />,
    link: "/products",
  },
  {
    name: "Accountability",
    icon: <DollarSign className="w-5 h-5 text-primary" />,
    link: "/accountability",
  },
];

export const SidebarMenu = () => {
  const pathname = usePathname();
  return (
    <div className="my-10 w-full">
      <h1 className="mb-4 text-sm font-semibold text-primary">Platform</h1>
      <ul className="flex flex-col items-start w-full gap-3 border-l px-3">
        {menu.map((item) => (
          <li
            onClick={() => {
              redirect(item.link);
            }}
            className={`flex items-center w-full gap-3 px-3 py-2 text-sm text-primary font-medium ${
              pathname === item.link && "bg-muted"
            } hover:bg-muted cursor-pointer rounded-md duration-200`}
            key={item.link}
          >
            {item.icon} <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
