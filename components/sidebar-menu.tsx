"use client";
import {
  ChartArea,
  LayoutDashboard,
  Notebook,
  Package,
  Sheet,
  ShoppingCartIcon,
  Tag,
} from "lucide-react";
import { redirect, usePathname } from "next/navigation";

const menu_platform = [
  {
    name: "Overview",
    icon: <LayoutDashboard className="w-5 h-5 text-primary" />,
    link: "/overview",
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
];

const menu_accounting = [
  {
    name: "Journal Entries",
    icon: <Notebook className="w-5 h-5 text-primary" />,
    link: "/journal-entries",
  },
  {
    name: "CoAs",
    icon: <ChartArea className="w-5 h-5 text-primary" />,
    link: "/chart-accounts",
  },
  {
    name: "Balance Sheet",
    icon: <Sheet className="w-5 h-5 text-primary" />,
    link: "/balance-sheet",
  },
];

export const SidebarMenu = () => {
  const pathname = usePathname();
  return (
    <div className="my-10 w-full">
      <h1 className="mb-4 text-sm font-semibold text-primary">Dashboard</h1>
      <ul className="flex flex-col items-start w-full gap-3 border-l px-3">
        {menu_platform.map((item) => (
          <li
            onClick={() => {
              redirect(item.link);
            }}
            className={`flex items-center w-full gap-3 px-3 py-2 text-sm text-primary border border-green-700/0 font-medium ${
              pathname === item.link && "bg-green-50 border-green-700/100"
            } hover:bg-green-50 cursor-pointer rounded-md duration-200`}
            key={item.link}
          >
            {item.icon} <span>{item.name}</span>
          </li>
        ))}
      </ul>
      <h1 className="mb-4 mt-4 text-sm font-semibold text-primary">
        Accounting
      </h1>
      <ul className="flex flex-col items-start w-full gap-3 border-l px-3">
        {menu_accounting.map((item) => (
          <li
            onClick={() => {
              redirect(item.link);
            }}
            className={`flex items-center w-full gap-3 px-3 py-2 text-sm text-primary border border-green-700/0 font-medium ${
              pathname === item.link && "bg-green-50 border-green-700/100"
            } hover:bg-green-50 cursor-pointer rounded-md duration-200`}
            key={item.link}
          >
            {item.icon} <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
