import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full bg-muted">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <Skeleton className="w-30 h-5" />

            <ChevronRight className="w-4 h-4" />
            <Skeleton className="w-30 h-5" />
          </ul>
        </div>
      </header>
      <div className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-40 h-7 bg-white" />
            <Skeleton className="w-60 h-5 bg-white" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 w-full">
          <Skeleton className="w-full h-25 bg-white my-5" />
          <Skeleton className="w-full h-25 bg-white my-5" />
          <Skeleton className="w-full h-25 bg-white my-5" />
        </div>
        <Skeleton className="w-full h-full bg-white my-5" />
      </div>
    </div>
  );
}
