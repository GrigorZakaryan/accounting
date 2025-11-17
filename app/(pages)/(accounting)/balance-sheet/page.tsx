import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { formatCurrency } from "@/utils/currency";
import { ChevronRight } from "lucide-react";

export default async function ChartAccountsPage() {
  const assetLines = await db.jounralLine.findMany({
    where: { chartAccount: { type: "ASSET" } },
    orderBy: { chartAccountId: "asc" },
  });

  const assets = await db.chartAccount.findMany({
    where: { type: "ASSET" },
    orderBy: { code: "asc" },
  });

  const groupedAssets = assetLines.reduce(
    (acc: Record<string, typeof assetLines>, item) => {
      if (!acc[item.chartAccountId]) acc[item.chartAccountId] = [];
      acc[item.chartAccountId].push(item);
      return acc;
    },
    {}
  );

  const totalAssets = assets.reduce((acc, curr) => {
    const lines = groupedAssets[curr.id] || [];
    return (
      acc +
      lines.reduce((acc1, curr1) => {
        if (curr1.type === "DEBIT") {
          return acc1 + curr1.amount;
        }
        return acc1 - curr1.amount;
      }, 0)
    );
  }, 0);

  // Liabilities

  const liabilityLines = await db.jounralLine.findMany({
    where: { chartAccount: { type: "LIABILITY" } },
    orderBy: { chartAccountId: "asc" },
  });

  const liabilities = await db.chartAccount.findMany({
    where: { type: "LIABILITY" },
    orderBy: { code: "asc" },
  });

  const groupedLiabilities = liabilityLines.reduce(
    (acc: Record<string, typeof liabilityLines>, item) => {
      if (!acc[item.chartAccountId]) acc[item.chartAccountId] = [];
      acc[item.chartAccountId].push(item);
      return acc;
    },
    {}
  );

  const totalLiabilities = liabilities.reduce((acc, curr) => {
    const lines = groupedLiabilities[curr.id] || [];
    return (
      acc +
      lines.reduce((acc1, curr1) => {
        if (curr1.type === "CREDIT") {
          return acc1 + curr1.amount;
        }
        return acc1 - curr1.amount;
      }, 0)
    );
  }, 0);

  return (
    <div className="w-full h-full bg-muted">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <li className="text-sm font-medium hover:opacity-100">
              Accountability
            </li>

            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium hover:opacity-100">
              Balance Sheet
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Balance Sheet</h1>
            <p className="text-sm text-muted-foreground">
              Here you can manage your balance sheet.
            </p>
          </div>
        </div>
        <div className="flex items-start justify-between w-full gap-10 mt-5">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>List of all of your assets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => {
                    const lines = groupedAssets[asset.id] || [];
                    return (
                      <TableRow
                        key={asset.id}
                        className="hover:bg-muted px-3 py-1 mb-2 duration-200"
                      >
                        <TableCell className="font-normal text-sm">
                          {asset.code} | {asset.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {lines.length === 0 ? (
                            <p className="text-sm text-muted-foreground">-</p>
                          ) : (
                            <span className="text-sm">
                              {formatCurrency(
                                lines.reduce((acc, curr) => {
                                  if (curr.type === "DEBIT") {
                                    return acc + curr.amount;
                                  }
                                  return acc - curr.amount;
                                }, 0)
                              )}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Separator />
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Total Assets</h2>
                  {totalAssets === 0 ? (
                    <p className="text-sm text-muted-foreground">-</p>
                  ) : (
                    <span className="font-medium">
                      {formatCurrency(totalAssets)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Liabilities</CardTitle>
              <CardDescription>List of all of your liabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liabilities.map((liability) => {
                    const lines = groupedLiabilities[liability.id] || [];
                    return (
                      <TableRow
                        key={liability.id}
                        className="hover:bg-muted px-3 py-1 mb-2 duration-200"
                      >
                        <TableCell className="font-normal text-sm">
                          {liability.code} | {liability.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {lines.length === 0 ? (
                            <p className="text-sm text-muted-foreground">-</p>
                          ) : (
                            <span className="text-sm">
                              {formatCurrency(
                                lines.reduce((acc, curr) => {
                                  if (curr.type === "CREDIT") {
                                    return acc + curr.amount;
                                  }
                                  return acc - curr.amount;
                                }, 0)
                              )}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Separator />
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Total Liabilities</h2>
                  {totalLiabilities === 0 ? (
                    <p className="text-sm text-muted-foreground">-</p>
                  ) : (
                    <span className="font-medium">
                      {formatCurrency(totalLiabilities)}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
