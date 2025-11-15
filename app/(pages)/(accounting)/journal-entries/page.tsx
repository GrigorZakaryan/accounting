import { ChevronRight } from "lucide-react";
import { JournalEntryContent } from "./components/content";
import { db } from "@/lib/db";

export default async function ChartAccountsPage() {
  const journalEntries = await db.journalEntry.findMany({
    include: {
      journalLines: {
        include: { chartAccount: true },
        orderBy: { chartAccount: { code: "asc" } },
      },
    },
  });
  return (
    <div className="w-full h-full bg-muted">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <li className="text-sm font-medium hover:opacity-100">
              Accountability
            </li>

            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium hover:opacity-100">
              Journal of Entries
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Journal of Entries</h1>
            <p className="text-sm text-muted-foreground">
              Here you can manage all your entries.
            </p>
          </div>
        </div>
        <JournalEntryContent journalEntries={journalEntries} />
      </div>
    </div>
  );
}
