export const operations: MultipleOperaionsProps[] = [
  {
    name: "Sale",
    defaultCategory: "INVENTORY",
    categories: ["MATERIAL_IMM", "IMMATERIAL_IMM", "INVENTORY"],
    quantity: 0,
    amount: 0,
  },
  {
    name: "Purchase",
    defaultCategory: "INVENTORY",
    categories: ["MATERIAL_IMM", "IMMATERIAL_IMM", "INVENTORY"],
    quantity: 0,
    amount: 0,
  },
  {
    name: "Loan",
    defaultCategory: "FINANCIAL",
    categories: ["FINANCIAL"],
    quantity: 0,
    amount: 0,
  },
];

export interface SingleOperationProps {
  name: allowedOperations;
  description?: string;
  category: assetsAllowedCategories;
  quantity: number;
  amount: number;
}

export interface MultipleOperaionsProps {
  name: allowedOperations;
  defaultCategory?: assetsAllowedCategories;
  categories: assetsAllowedCategories[];
  quantity: number;
  amount: number;
}

export type allowedOperations = "Sale" | "Purchase" | "Loan";

export type assetsAllowedCategories =
  | "IMMATERIAL_IMM"
  | "MATERIAL_IMM"
  | "INVENTORY"
  | "FINANCIAL"
  | "CREDITS"
  | "LIQUID_ASSETS";

export type liabilitiesAllowedCategories = "MID_LONG_DEBTS" | "SHORT_DEBTS";

export const assetsCategories: assetsAllowedCategories[] = [
  "IMMATERIAL_IMM",
  "MATERIAL_IMM",
  "INVENTORY",
  "FINANCIAL",
  "CREDITS",
  "LIQUID_ASSETS",
];

export const liabilityCategories: liabilitiesAllowedCategories[] = [
  "MID_LONG_DEBTS",
  "SHORT_DEBTS",
];
