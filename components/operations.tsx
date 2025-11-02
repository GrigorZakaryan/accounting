import { HandCoins, Landmark, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";

export const Operations = () => {
  return (
    <div className="flex items-center justify-center text-white">
      <div className="gap-3 grid grid-cols-2 max-w-2xl">
        <Link href={"/investment"}>
          <div className="aspect-square flex min-w-[200px]  bg-white/90 hover:bg-white/100 text-primary hover:shadow-xl duration-300 cursor-pointer rounded-md">
            <div className="flex flex-col items-start justify-between px-5 pt-5 pb-5 gap-5">
              <div className="p-3 bg-[#2C5C4C] rounded-full">
                <HandCoins className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="font-semibold text-xl">Investment</span>
                <p className="text-sm opacity-80">Record new investment</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href={"/bank"}>
          <div className="aspect-square flex min-w-[200px]  bg-white/90 hover:bg-white/100 text-primary hover:shadow-xl duration-300 cursor-pointer rounded-md">
            <div className="flex flex-col items-start justify-between px-5 pt-5 pb-5 gap-5">
              <div className="p-3 bg-[#2C5C4C] rounded-full">
                <Landmark className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="font-semibold text-xl">Bank</span>
                <p className="text-sm opacity-80">
                  Record new bank transaction
                </p>
              </div>
            </div>
          </div>
        </Link>
        <Link href={"/purchase"}>
          <div className="aspect-square flex min-w-[200px] bg-white/90 hover:bg-white/100 text-primary hover:shadow-xl duration-300 cursor-pointer rounded-md">
            <div className="flex flex-col items-start justify-between px-5 pt-5 pb-5 gap-5">
              <div className="p-3 bg-[#2C5C4C] rounded-full">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="font-semibold text-xl">Purchase</span>
                <p className="text-sm opacity-80">Record new purchase</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href={"/sale"}>
          <div className="aspect-square flex min-w-[200px] bg-white/90 hover:bg-white/100 text-primary hover:shadow-xl duration-300 cursor-pointer rounded-md">
            <div className="flex flex-col items-start justify-between px-5 pt-5 pb-5 gap-5">
              <div className="p-3 bg-[#2C5C4C] rounded-full">
                <Tag className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="font-semibold text-xl">Sale</span>
                <p className="text-sm opacity-80">Record new sale</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
