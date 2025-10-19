"use client";

import axios from "axios";
import { useEffect } from "react";
``;

export default function Page() {
  const handleRequest = async () => {
    const res = axios.post("/api", {
      operationType: "PURCHASE",
      name: "Printers",
      quantity: 10,
      amount: 190,
    });
    return res;
  };
  useEffect(() => {
    console.log(handleRequest());
  }, []);
  return <div>{JSON.stringify(handleRequest())}</div>;
}
