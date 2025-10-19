"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assetsAllowedCategories,
  allowedOperations,
  operations,
  SingleOperationProps,
} from "@/operations";
import { useState } from "react";
import BalanceSheet from "@/components/balance-sheet";

export default function Home() {
  const [selectedOperation, setOperation] = useState<allowedOperations | null>(
    null
  );
  const [selectedCategory, setCategory] = useState<
    assetsAllowedCategories | null | undefined
  >(null);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [amount, setAmount] = useState<number>(0);
  const [allOperations, setAllOperations] = useState<SingleOperationProps[]>(
    []
  );

  const handleSelectOperation = (value: allowedOperations) => {
    setDescription("");
    setAmount(0);
    setQuantity(1);

    setOperation(value);
    setCategory(operations.find((opr) => opr.name === value)?.defaultCategory);
  };

  const createOperation = () => {
    if (!selectedOperation) return console.error("Operation is required!");
    if (!selectedCategory) return console.error("Category is required!");

    const operation: SingleOperationProps = {
      name: selectedOperation,
      description: description,
      category: selectedCategory,
      quantity: quantity,
      amount: amount * quantity,
    };

    setAllOperations((prev) => [...prev, operation]);
    setDescription("");
    setAmount(0);
    setQuantity(1);
  };

  return (
    <div className="w-full p-26">
      <h1>Create an operation.</h1>
      <div className="w-full flex items-center gap-5 mt-5">
        <Select
          onValueChange={(e) => handleSelectOperation(e as allowedOperations)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Operation" />
          </SelectTrigger>
          <SelectContent>
            {operations.map((opr) => {
              return (
                <SelectItem key={opr.name} value={opr.name}>
                  {opr.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(e) => setCategory(e as assetsAllowedCategories)}
          value={selectedCategory || ""}
          disabled={!selectedOperation}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {operations
              .find((opr) => opr.name === selectedOperation)
              ?.categories.map((ctg) => {
                return (
                  <SelectItem key={ctg} value={ctg}>
                    {ctg}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>

        {(selectedOperation === "Purchase" || selectedOperation === "Sale") && (
          <div className="flex items-center gap-5">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!selectedCategory}
              className="w-full max-w-[200px]"
              type="text"
              placeholder="Description"
            />
            <Input
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={!selectedCategory}
              className="w-full max-w-[200px]"
              type="number"
              placeholder="Qty."
            />
          </div>
        )}
        <Input
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={!selectedCategory}
          className="w-full max-w-[200px]"
          type="number"
          placeholder="0,00$"
        />
        <Button onClick={createOperation}>Create Transaction</Button>
      </div>

      <Table className="mt-10">
        <TableCaption>A Table of Business Transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Transcation</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Quantity</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allOperations.map((opr, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell className="text-left">T-00{0 + idx + 1}</TableCell>
                <TableCell className="text-center">{opr.name}</TableCell>
                <TableCell className="text-center">{opr.category}</TableCell>
                <TableCell className="text-center">
                  {opr.description || "-"}
                </TableCell>
                <TableCell className="text-center">{opr.quantity}</TableCell>
                <TableCell className="text-right">
                  {Intl.NumberFormat("it-IT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(opr.amount * opr.quantity)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
