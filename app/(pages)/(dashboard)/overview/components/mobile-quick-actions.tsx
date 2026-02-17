import {
  ArrowUpRight,
  ChartArea,
  Notebook,
  ShoppingCart,
  Tag,
} from "lucide-react";
import Link from "next/link";
export const QuickActionsMobile = () => {
  return (
    <div className="w-full overflow-x-auto flex items-center gap-4">
      <Link className="flex-1" href={"/purchases/invoice"}>
        <div className="flex-1 flex-col min-w-[150px] min-h-[130px] justify-between w-full h-full border border-green-300 rounded-xl bg-green-100 p-3 text-primary hover:bg-green-200 duration-200 cursor-pointer">
          <div className="flex items-start justify-between w-full">
            <span className="font-medium text-md lg:text-xl">
              Record Purchase
            </span>
            <ArrowUpRight className="w-7 h-7" />
          </div>
          <div className="flex justify-end mt-5">
            <ShoppingCart className="w-10 h-10 lg:w-15 lg:h-15 text-green-700" />
          </div>
        </div>
      </Link>
      <Link className="flex-1" href={"/sales/invoice"}>
        <div className="flex-1 flex-col min-w-[150px] min-h-[130px] justify-between w-full h-full border border-red-300 rounded-xl bg-red-100 p-3 text-red-900 hover:bg-red-200 duration-200 cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-md lg:text-xl">Record Sale</span>
            <ArrowUpRight />
          </div>
          <div className="flex justify-end items-end mt-10">
            <Tag className="w-10 h-10 lg:w-15 lg:h-15 text-red-700" />
          </div>
        </div>
      </Link>
      <Link className="flex-1" href={"/journal-entries/create"}>
        <div className="flex-1 flex-col min-w-[150px] min-h-[130px] justify-between w-full h-full border border-yellow-300 rounded-xl bg-yellow-100 p-3 text-yellow-900 hover:bg-yellow-200 duration-200 cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-md lg:text-xl">Record Entry</span>
            <ArrowUpRight />
          </div>
          <div className="flex justify-end">
            <Notebook className="w-10 h-10 mt-10 lg:w-15 lg:h-15 text-yellow-700" />
          </div>
        </div>
      </Link>
      <Link className="flex-1" href={"/chart-accounts/create"}>
        <div className="flex-1 flex-col min-w-[150px] min-h-[130px] justify-between w-full h-full border border-violet-300 rounded-xl bg-violet-100 p-3 text-violet-900 hover:bg-violet-200 duration-200 cursor-pointer">
          <div className="flex items-center justify-between w-full">
            <span className="font-medium text-md lg:text-xl">New CoA</span>
            <ArrowUpRight />
          </div>
          <div className="flex justify-end">
            <ChartArea className="w-10 h-10 mt-10 lg:w-15 lg:h-15 text-violet-700" />
          </div>
        </div>
      </Link>
    </div>
  );
};
