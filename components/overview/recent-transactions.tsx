import { JournalEntry } from "@/lib/generated/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { format } from "date-fns";
import Link from "next/link";

export const RecentTransactions = ({
  journalEntries,
}: {
  journalEntries: JournalEntry[];
}) => {
  return (
    <Card className="w-full shadow-none">
      <CardHeader>
        <CardTitle>Recent Transaction</CardTitle>
        <CardDescription>
          Explore transactions recorded recently.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex w-full aspect-video overflow-y-auto">
        <div className="flex flex-col w-full">
          <div className="w-full grid grid-cols-2 mb-3">
            <span className="font-medium text-sm">Date</span>
            <span className="font-medium text-sm">Description</span>
          </div>
          {journalEntries.map((entry, idx) => {
            if (idx < 6) {
              return (
                <Link
                  className="w-full"
                  key={entry.id}
                  href={"/journal-entries"}
                >
                  <div className="w-full border-t py-3 hover:bg-muted px-2 cursor-pointer duration-200">
                    <div className="grid grid-cols-2">
                      <span className="text-sm">
                        {format(entry.date, "dd MMM yyyy - HH:mm")}
                      </span>
                      <span className="text-sm font-medium">
                        {entry.description ? entry.description : "-"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
        {journalEntries.length === 0 && <div>No recent transaction.</div>}
      </CardContent>
    </Card>
  );
};
