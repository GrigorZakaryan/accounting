export const operations: MultipleOperaionsProps[] = [
  {
    name: "Sale",
    defaultCategory: "Inventory",
    categories: ["Material", "Immaterial", "Inventory"],
    quantity: 0,
    amount: 0,
  },
  {
    name: "Purchase",
    defaultCategory: "Inventory",
    categories: ["Material", "Immaterial", "Inventory"],
    quantity: 0,
    amount: 0,
  },
  {
    name: "Loan",
    defaultCategory: "Financial",
    categories: ["Financial"],
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
  | "Immaterial"
  | "Material"
  | "Inventory"
  | "Financial"
  | "Credits"
  | "Liquid Assets";

export type liabilitiesAllowedCategories =
  | "Medium-Long Term Debts"
  | "Short Term Debts";

export const assetsCategories: assetsAllowedCategories[] = [
  "Immaterial",
  "Material",
  "Inventory",
  "Financial",
  "Credits",
  "Liquid Assets",
];

export const liabilityCategories: liabilitiesAllowedCategories[] = [
  "Medium-Long Term Debts",
  "Short Term Debts",
];
