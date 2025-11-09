"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { inputCustomerSchema } from "@/schemas/customer-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Save } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const CustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof inputCustomerSchema>>({
    resolver: zodResolver(inputCustomerSchema),
    defaultValues: {
      legalName: "",
      vatNumber: "",
      email: "",
      phone: "",
      country: "",
      address: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof inputCustomerSchema>) {
    setLoading(true);
    const res = await axios.post("/sales/customer/api", {
      customerData: { ...values },
    });

    if (res.status !== 200) {
      alert("Something went wrong!");
      setLoading(false);
    }
    setLoading(false);
    redirect("/sales");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-5 w-full">
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Legal Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-white"
                        placeholder="ZakaWeb Inc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vatNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>VAT/TAX Number</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-white"
                        placeholder="VAT123456789"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-5 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="email"
                        className="bg-white"
                        placeholder="name.surname@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Phone Number{" "}
                      <span className="text-sm text-muted-foreground">
                        {"(optional)"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-white"
                        placeholder="+39 123 456 7891"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-5 w-full">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-white"
                        placeholder="Italy"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        className="bg-white"
                        placeholder="Via Giuseppe Verdi 14, 20121 Milano MI"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-5 w-full">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Notes{" "}
                      <span className="text-sm text-muted-foreground">
                        {"(optional)"}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        className="bg-white"
                        placeholder="Start typing here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end w-full gap-3">
              <Button
                disabled={loading}
                variant={"outline"}
                onClick={() => redirect("/sales")}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <Save /> Save Customer
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
