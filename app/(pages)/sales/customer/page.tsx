import { ChevronRight, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { CustomerForm } from "./components/customer-form";

export default function Customer() {
  return (
    <div className="w-full h-full bg-muted overflow-y-scroll">
      <header className="w-full h-16 bg-white border-b fixed">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <Link href={"/"}>
              <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                Dashboard
              </li>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={"/purchases"}>
              <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                Sales
              </li>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium cursor-pointer hover:opacity-100">
              Create Customer
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5 pt-20">
        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserRoundPlus className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold text-primary">
              Add Customer
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new customer.
          </p>
        </div>
      </div>
      <div className="px-5 pb-10">
        <CustomerForm />
      </div>
    </div>
  );
}
