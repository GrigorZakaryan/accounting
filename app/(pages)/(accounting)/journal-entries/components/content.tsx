"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, AnimatePresence } from "motion/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartAccount, JournalEntry } from "@/lib/generated/prisma";
import { format } from "date-fns";
import { MoreHorizontal, Plus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  convertDecimalToInt,
  convertIntToDecimal,
  formatCurrency,
} from "@/utils/currency";

export interface JournalEntriesProps {
  id: string;
  date: Date;
  description?: string | null;
  sourceType: string | null;
  invoiceId: string | null;
  paymentId: string | null;
  journalLines: JournalLines[];
}

export interface JournalLines {
  id: string;
  jounralEntryId: string;
  chartAccountId: string;
  chartAccount: ChartAccount;
  description: String;
  amount: number;
  type: "CREDIT" | "DEBIT";
  createdAt: Date;
}

export const JournalEntryContent = ({
  journalEntries,
}: {
  journalEntries: JournalEntriesProps[];
}) => {
  const [selectedRow, setRow] = useState<JournalEntriesProps | null>();
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between w-full">
        <div>
          <h2 className="font-medium">List of Entries</h2>
          <p className="text-sm text-muted-foreground">
            Here you can manage all of your journal entries.
          </p>
        </div>
        <Link href={"/journal-entries/create"}>
          <Button>
            <Plus />
            Create Entry
          </Button>
        </Link>
      </div>
      <AnimatePresence>
        <Card key={"entry-table"} className="mt-5">
          <CardContent>
            <Table>
              <TableCaption>List of Journal Entries</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Lines</TableHead>
                  <TableHead className="text-center">Debits</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journalEntries.map((line) => (
                  <motion.tr
                    onClick={(e) => {
                      e.stopPropagation();
                      setRow(line);
                    }}
                    className="relative z-0 cursor-pointer hover:bg-muted duration-200 border-b"
                    key={line.id}
                  >
                    <motion.td layout layoutId={`line-${line.id}-date`}>
                      {format(line.date, "dd/MM/yyyy")}
                    </motion.td>
                    <motion.td layout layoutId={`line-${line.id}-description`}>
                      {line.description ? line.description : "-"}
                    </motion.td>
                    <motion.td
                      layout
                      layoutId={`line-${line.id}-journalLines`}
                      className="text-center"
                    >
                      {line.journalLines.length}
                    </motion.td>
                    <TableCell className="text-center">
                      {
                        line.journalLines.filter(
                          (line) => line.type === "DEBIT",
                        ).length
                      }
                    </TableCell>

                    <TableCell className="text-center">
                      {
                        line.journalLines.filter(
                          (line) => line.type === "CREDIT",
                        ).length
                      }
                    </TableCell>
                    <TableCell
                      className="relative z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("More");
                      }}
                    >
                      <MoreHorizontal className="w-5 h-5 cursor-pointer" />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {selectedRow && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setRow(null);
            }}
          >
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: "100%", height: "100%", opacity: 100 }}
              exit={{ width: 0, height: 0, opacity: 0 }}
              transition={{ duration: 0.7 }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-full max-w-[80%] max-h-[90dvh] bg-muted z-30 rounded-2xl relative"
            >
              <div className="p-7">
                <motion.h1
                  className="text-2xl font-semibold"
                  layout
                  layoutId={`line-${selectedRow.id}-date`}
                >
                  {format(selectedRow.date, "dd MMM yyyy")}
                </motion.h1>
                <X
                  onClick={(e) => {
                    e.stopPropagation();
                    setRow(null);
                  }}
                  className="w-5 h-5 cursor-pointer absolute top-7 right-7"
                />

                <motion.p
                  layout
                  layoutId={`line-${selectedRow.id}-description`}
                  className="text-muted-foregroun"
                >
                  {selectedRow.description
                    ? selectedRow.description
                    : "Description: -"}
                </motion.p>
                <div className="mt-5">
                  <motion.h2
                    className="font-medium"
                    layout
                    layoutId={`line-${selectedRow.id}-journalLines`}
                  >
                    Journal Lines {`(${selectedRow.journalLines.length})`}
                  </motion.h2>
                  <div className="border p-3 rounded-md shadow mt-5 bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableCell className="text-left">
                            Account Code
                          </TableCell>
                          <TableCell className="text-left">
                            Account Name
                          </TableCell>
                          <TableCell className="text-center">Debit</TableCell>
                          <TableCell className="text-center">Credit</TableCell>
                          <TableCell className="text-center"></TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRow.journalLines.map((line) => (
                          <TableRow key={line.id}>
                            <TableCell className="text-left">
                              {line.chartAccount.code}
                            </TableCell>
                            <TableCell className="text-left">
                              {line.chartAccount.name}
                            </TableCell>
                            <TableCell className="text-center">
                              {line.type === "DEBIT"
                                ? formatCurrency(line.amount)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              {line.type === "CREDIT"
                                ? formatCurrency(line.amount)
                                : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              <MoreHorizontal className="w-5 h-5" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
