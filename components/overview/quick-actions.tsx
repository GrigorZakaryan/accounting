import {
  ArrowUpRight,
  ChartArea,
  Notebook,
  ShoppingCart,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";

export const QuickActions = () => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Access to core function of the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 h-full">
        <Link href={"/purchases/invoice"}>
          <div className="flex flex-col justify-between w-full h-full border border-green-300 rounded-xl bg-green-100 p-3 text-primary hover:bg-green-200 duration-200 cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-xl">Record Purchase</span>
              <ArrowUpRight />
            </div>
            <div className="flex justify-end">
              <ShoppingCart className="w-15 h-15 text-green-700" />
            </div>
          </div>
        </Link>
        <Link href={"/sales/invoice"}>
          <div className="flex flex-col justify-between w-full h-full border border-red-300 rounded-xl bg-red-100 p-3 text-red-900 hover:bg-red-200 duration-200 cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-xl">Record Sale</span>
              <ArrowUpRight />
            </div>
            <div className="flex justify-end">
              <Tag className="w-15 h-15 text-red-700" />
            </div>
          </div>
        </Link>
        <Link href={"/journal-entries/create"}>
          <div className="flex flex-col justify-between w-full h-full border border-yellow-300 rounded-xl bg-yellow-100 p-3 text-yellow-900 hover:bg-yellow-200 duration-200 cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-xl">Record Entry</span>
              <ArrowUpRight />
            </div>
            <div className="flex justify-end">
              <Notebook className="w-15 h-15 text-yellow-700" />
            </div>
          </div>
        </Link>
        <Link href={"/chart-accounts/create"}>
          <div className="flex flex-col justify-between w-full h-full border border-violet-300 rounded-xl bg-violet-100 p-3 text-violet-900 hover:bg-violet-200 duration-200 cursor-pointer">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-xl">New CoA</span>
              <ArrowUpRight />
            </div>
            <div className="flex justify-end">
              <ChartArea className="w-15 h-15 text-violet-700" />
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};
