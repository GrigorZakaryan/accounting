"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { inputCoASchema } from "@/schemas/chart-account-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const CoAForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof inputCoASchema>>({
    resolver: zodResolver(inputCoASchema),
    defaultValues: {
      code: "",
      name: "",
      type: "ASSET",
    },
  });

  const onSubmit = async (values: z.infer<typeof inputCoASchema>) => {
    try {
      setLoading(true);
      await axios.post("/chart-accounts/api", values);
      toast.success("CoA created successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      form.setValue("code", "");
      form.setValue("name", "");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-start space-x-5 w-full">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} placeholder="1010" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        {...field}
                        placeholder="e.g. Software"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        disabled={loading}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger disabled={loading}>
                          <SelectValue
                            placeholder={"Choose one of the types provided"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ASSET">Asset</SelectItem>
                          <SelectItem value="LIABILITY">Liability</SelectItem>
                          <SelectItem value="EQUITY">Equity</SelectItem>
                          <SelectItem value="INCOME">Income</SelectItem>
                          <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Link href={"/chart-accounts"}>
                <Button
                  className="cursor-pointer"
                  disabled={loading}
                  variant={"outline"}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                className="cursor-pointer"
                disabled={loading}
                type="submit"
              >
                {loading ? <Spinner /> : "Create"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};
