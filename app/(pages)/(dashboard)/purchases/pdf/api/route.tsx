export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright-core";
import chromiumBinary from "@sparticuz/chromium";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    const isProd = !!process.env.VERCEL_URL;

    const browser = await chromium.launch(
      isProd
        ? {
            args: [
              ...chromiumBinary.args,
              "--no-sandbox",
              "--disable-setuid-sandbox",
            ],
            executablePath: await chromiumBinary.executablePath(),
            headless: true,
          }
        : {
            headless: true,
          },
    );

    const page = await browser.newPage();

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    console.log(`${baseUrl}/purchases/pdf/${id}`);

    await page.goto(`${baseUrl}/purchases/pdf/${id}`, {
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
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
