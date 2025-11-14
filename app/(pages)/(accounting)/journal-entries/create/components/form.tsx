"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChartAccount } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { inputJournalEntrySchema } from "@/schemas/journal-entry-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export interface JournalLineType {
  id: string;
  description: string;
  chartAccountId: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
}

export const JournalEntryForm = ({ CoAs }: { CoAs: ChartAccount[] }) => {
  const [loading, setLoading] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof inputJournalEntrySchema>>({
    resolver: zodResolver(inputJournalEntrySchema),
    defaultValues: {
      date: new Date(),
      description: "",
    },
  });
  const [journalLines, setJournalLines] = useState([
    {
      id: useId(),
      chartAccountId: "",
      description: "",
      type: "CREDIT",
      amount: 0,
      open: false,
    },
    {
      id: useId(),
      chartAccountId: "",
      description: "",
      type: "DEBIT",
      amount: 0,
      open: false,
    },
  ]);

  // use this to generate ids for new lines (no hooks inside handlers)
  const generateLineId = () => crypto?.randomUUID?.() ?? String(Date.now());

  // add a new line — use functional state update and generate id without useId()
  const addJournalLine = () => {
    const newLine = {
      id: generateLineId(),
      chartAccountId: "",
      description: "",
      type: "CREDIT",
      amount: 0,
      open: false,
    };

    setJournalLines((prev) => [...prev, newLine]);
  };

  // remove a line — functional update
  const removeJournalLine = (id: string) => {
    setJournalLines((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((line) => line.id !== id);
    });
  };

  // toggle popover — functional update to avoid stale closures
  const toggleLinePopover = ({ id, value }: { id: string; value: boolean }) => {
    setJournalLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, open: value } : line))
    );
  };

  // updateJournalLine is already correct in your last snippet; keep it functional
  // const updateJournalLine = ({ id, value, field }) => { setJournalLines(prev => prev.map(...)) };

  const updateJournalLine = ({
    id,
    value,
    field,
  }: {
    id: string;
    value: number | string | null;
    field: keyof JournalLineType;
  }) => {
    setJournalLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, [field]: value } : line))
    );
  };

  const onSubmit = async (values: z.infer<typeof inputJournalEntrySchema>) => {
    try {
      setLoading(true);
      const res = await axios.post("/journal-entries/create/api", {
        ...values,
        journalLines: journalLines.map((line) => ({
          chartAccountId: line.chartAccountId,
          description: line.description,
          type: line.type,
          amount: line.amount,
        })),
      });
      toast.success("Journal Entry created successfully!");
      router.push("/journal-entries");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>New Journal Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-5">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="min-w-[300px]">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                          <PopoverTrigger disabled={loading} asChild>
                            <Button
                              disabled={loading}
                              variant="outline"
                              id="date"
                              className="w-full justify-between font-normal"
                            >
                              {field.value
                                ? field.value.toLocaleDateString()
                                : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                date && form.setValue("date", date);
                                setDateOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-w-[400px]"
                          {...field}
                          placeholder="Type here..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between w-full">
                  <h2 className="font-medium">Journal Lines</h2>
                  <Button onClick={() => addJournalLine()}>
                    <Plus /> Add Line
                  </Button>
                </div>
                <div className="flex flex-col items-start gap-5 mt-5 p-5 rounded-lg bg-muted border">
                  {journalLines.map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <Popover
                        open={line.open}
                        onOpenChange={(open) =>
                          toggleLinePopover({ id: line.id, value: open })
                        }
                      >
                        <PopoverTrigger className="w-[400px]" asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={line.open}
                            className="w-[300px] justify-between"
                          >
                            {line.chartAccountId ? (
                              <>
                                {
                                  CoAs.find(
                                    (CoA) => CoA.id === line.chartAccountId
                                  )?.code
                                }{" "}
                                |{" "}
                                {
                                  CoAs.find(
                                    (CoA) => CoA.id === line.chartAccountId
                                  )?.name
                                }
                              </>
                            ) : (
                              "Select account..."
                            )}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search account..." />
                            <CommandList className="min-w-[400px]">
                              <CommandEmpty>No account found.</CommandEmpty>
                              <CommandGroup>
                                {CoAs.map((CoA) => (
                                  <CommandItem
                                    key={CoA.id}
                                    value={CoA.name.toLocaleLowerCase()}
                                    onSelect={() => {
                                      updateJournalLine({
                                        id: line.id,
                                        field: "chartAccountId",
                                        value: CoA.id,
                                      });
                                      toggleLinePopover({
                                        id: line.id,
                                        value: false,
                                      });
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        line.chartAccountId === CoA.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {CoA.code} | {CoA.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Input
                        className="bg-white"
                        value={line.amount}
                        onChange={(e) =>
                          updateJournalLine({
                            id: line.id,
                            field: "amount",
                            value: Number(e.target.value),
                          })
                        }
                        type="number"
                        min={0}
                        placeholder="0"
                      />
                      <Select
                        value={line.type}
                        onValueChange={(e) =>
                          updateJournalLine({
                            id: line.id,
                            field: "type",
                            value: e,
                          })
                        }
                      >
                        <SelectTrigger className="min-w-[100px] bg-white">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CREDIT">Credit</SelectItem>
                          <SelectItem value="DEBIT">Debit</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => {
                          if (journalLines.length > 2) {
                            removeJournalLine(line.id);
                          }
                        }}
                        disabled={journalLines.length <= 2}
                        size={"icon"}
                        variant={"destructive"}
                      >
                        <Trash className="text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end w-full mt-5 gap-2">
            <Button variant={"outline"} type="submit">
              Cancel
            </Button>
            <Button type="submit">
              <Save /> Create Entry
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
