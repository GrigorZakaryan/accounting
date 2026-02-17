import { JournalEntryContent } from "./components/content";
import { db } from "@/lib/db";
import { Header } from "../../components/header";
import { convertIntToDecimal } from "@/utils/currency";

export default async function ChartAccountsPage() {
  const journalEntries = await db.journalEntry.findMany({
    include: {
      journalLines: {
        include: { chartAccount: true },
      },
    },
  });

  const formattedJournalEntries = journalEntries.map((entry) => ({
    ...entry,
    journalLines: entry.journalLines.map((line) => ({
      ...line,
      amount: convertIntToDecimal(line.amount),
    })),
  }));
  return (
    <div className="w-full h-full bg-muted">
      <Header
        links={[
          { label: "Accountibility", link: "/overview" },
          { label: "Journal Entries" },
        ]}
      />
      <div className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Journal of Entries</h1>
            <p className="text-sm text-muted-foreground">
              Here you can manage all your entries.
            </p>
          </div>
        </div>
        <JournalEntryContent journalEntries={formattedJournalEntries} />
      </div>
    </div>
  );
}
