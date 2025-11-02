import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SalesPage() {
  return (
    <div className="w-full h-full bg-muted">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <Link href={"/"}>
              <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                Dashboard
              </li>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium cursor-pointer hover:opacity-100">
              Sales
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5">Sales</div>
    </div>
  );
}
