import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { amount, date, notes, invoiceId } = body;

    // Basic validation
    if (!invoiceId)
      return NextResponse.json(
        { error: "Invoice field is missing!" },
        { status: 400 }
      );
    if (!amount)
      return NextResponse.json(
        { error: "Amount field is missing!" },
        { status: 400 }
      );
    if (!date)
      return NextResponse.json(
        { error: "Date field is missing!" },
        { status: 400 }
      );

    // Find the invoice
    const existingInvoice = await db.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!existingInvoice)
      return NextResponse.json(
        { error: "Invoice doesn't exist!" },
        { status: 404 }
      );

    // Calculate current total paid
    const totalPaid = existingInvoice.payments.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );

    // If it's already paid, no more payments allowed
    if (Math.abs(totalPaid - Number(existingInvoice.total)) < 0.01) {
      if (existingInvoice.status !== "PAID") {
        await db.invoice.update({
          where: { id: existingInvoice.id },
          data: { status: "PAID" },
        });
      }
      return NextResponse.json(
        { message: "Invoice is already fully paid!" },
        { status: 409 }
      );
    }

    // Create the new payment
    const payment = await db.payment.create({
      data: { amount, invoiceId, note: notes, date },
    });

    // Update total payments directly
    const updatedTotal = totalPaid + Number(amount);

    // If invoice is now fully paid, mark it as PAID
    if (Math.abs(updatedTotal - Number(existingInvoice.total)) < 0.01) {
      await db.invoice.update({
        where: { id: existingInvoice.id },
        data: { status: "PAID" },
      });

      return NextResponse.json({
        message: "Payment recorded and invoice marked as fully paid!",
        payment,
      });
    }

    // Otherwise just confirm payment
    return NextResponse.json({
      message: "Payment recorded successfully!",
      payment,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
};
