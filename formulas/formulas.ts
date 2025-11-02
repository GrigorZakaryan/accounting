import { db } from "@/lib/db";

export const bankBalance = async () => {
  const bank = await db.asset.findUnique({ where: { id: "1" } });
  return bank?.amount ?? 0;
};

export const netWorth = async () => {
  const assets = await db.asset.findMany({});
  const liabilities = await db.liability.findMany({});
  const networth =
    assets.reduce(
      (acc, asset) => acc + asset.amount * (asset.quantity ?? 1),
      0
    ) - liabilities.reduce((acc, liability) => acc + liability.amount, 0);

  return networth;
};

export const equityCapital = async () => {
  const operations = await db.operation.findMany({});
  const equity =
    operations.reduce((acc, opr) => acc + (opr.amount ?? 0), 0) ?? 0;
  return equity ?? 0;
};
