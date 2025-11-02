import { Store } from "lucide-react";
import { SidebarMenu } from "./sidebar-menu";

export const Sidebar = () => {
  return (
    <div className="flex min-w-60 h-[100dvh] border-r border-black/10 bg-white">
      <div className="flex flex-col px-5 py-5 w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="bg-[#2C5C4C] rounded-lg p-2">
            <Store className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-md text-primary">Zakaweb Inc.</h1>
            <p className="text-sm text-muted-foreground">Enterprise</p>
          </div>
        </div>
        <SidebarMenu />
      </div>
    </div>
  );
};
