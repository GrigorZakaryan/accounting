export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const browser = await chromium.launch({
      args: chromiumBinary.args,
      executablePath: await chromiumBinary.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(`localhost:3000/purchases/pdf/${id}`, {
      waitUntil: "networkidle",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="invoice.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "PDF generation failed" },
      { status: 500 },
    );
  }
}
