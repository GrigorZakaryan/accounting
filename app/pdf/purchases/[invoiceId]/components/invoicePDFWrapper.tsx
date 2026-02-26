"use client";

import dynamic from "next/dynamic";

const InvoicePDFContent = dynamic(
  () => import("./content").then((mod) => mod.InvoicePDFContent),
  { ssr: false },
);

export default function InvoicePDFWrapper(props: any) {
  return <InvoicePDFContent {...props} />;
}
