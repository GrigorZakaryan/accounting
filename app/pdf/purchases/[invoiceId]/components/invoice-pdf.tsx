import { Business } from "@/lib/generated/prisma";
import { Invoice } from "@/types/purchases";
import { convertIntToDecimal, formatCurrency } from "@/utils/currency";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

type Props = {
  invoice: Invoice;
  business: Business;
  subtotal: number;
  taxedAmount: number;
  total: number;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
  },

  title: {
    fontSize: 22,
    marginBottom: 20,
  },

  section: {
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  column: {
    width: "48%",
    gap: "4px",
  },

  table: {
    marginTop: 20,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
  },

  tableCell: {
    padding: 6,
  },

  // Column layout
  colDescription: { flex: 3 },
  colQty: { flex: 1 },
  colUnitPrice: { flex: 2 },
  colDiscount: { flex: 2 },
  colTax: { flex: 1 },
  colAmount: { flex: 2 },

  right: {
    textAlign: "right",
  },

  fontMedium: {
    fontWeight: "600",
  },

  fontBold: {
    fontWeight: "700",
  },

  summary: {
    marginTop: 30,
    width: 220,
    alignSelf: "flex-end",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  total: {
    fontSize: 12,
    fontWeight: 700,
  },
});

export const InvoicePDFTemplate = ({
  invoice,
  business,
  subtotal,
  taxedAmount,
  total,
}: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={[styles.title, styles.fontBold]}>
        INVOICE-{invoice?.number}
      </Text>

      <View style={styles.section}>
        <Text>
          Issue Date:{" "}
          {invoice?.issueDate && format(invoice.issueDate, "dd MMM yyyy")}
        </Text>
        <Text>
          Due Date: {invoice?.dueDate && format(invoice.dueDate, "dd MMM yyyy")}
        </Text>
      </View>

      <View style={[styles.row, styles.section]}>
        <View style={styles.column}>
          <Text style={styles.fontMedium}>Supplier</Text>
          <Text>{invoice?.vendor?.legalName}</Text>
          <Text>
            {invoice?.vendor?.address}, {invoice?.vendor?.country}
          </Text>
          <Text>{invoice?.vendor?.vatNumber ?? invoice?.vendor?.fiscalId}</Text>
        </View>

        <View style={[styles.column, { textAlign: "right" }]}>
          <Text style={styles.fontMedium}>Customer</Text>
          <Text>{business?.legalName}</Text>
          <Text>
            {business?.address}, {business?.country}
          </Text>
          <Text>{business?.vatNumber}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.tableRow]}>
          <Text
            style={[styles.tableCell, styles.colDescription, styles.fontMedium]}
          >
            Description
          </Text>
          <Text style={[styles.tableCell, styles.colQty, styles.fontMedium]}>
            Qty
          </Text>
          <Text
            style={[styles.tableCell, styles.colUnitPrice, styles.fontMedium]}
          >
            Unit Price
          </Text>
          <Text
            style={[styles.tableCell, styles.colDiscount, styles.fontMedium]}
          >
            Discount %
          </Text>
          <Text style={[styles.tableCell, styles.colTax, styles.fontMedium]}>
            Tax %
          </Text>
          <Text
            style={[
              styles.tableCell,
              styles.colAmount,
              styles.right,
              styles.fontMedium,
            ]}
          >
            Amount
          </Text>
        </View>

        {/* Body */}
        {invoice.items.map((item: any) => (
          <View style={styles.tableRow} key={item.id}>
            <Text style={[styles.tableCell, styles.colDescription]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCell, styles.colQty]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, styles.colUnitPrice]}>
              {formatCurrency(convertIntToDecimal(item.unitPrice))}
            </Text>
            <Text style={[styles.tableCell, styles.colDiscount]}>
              {item.discounts.map((d: any) =>
                d.value === 0 ? null : `${d.value}% `,
              )}
            </Text>
            <Text style={[styles.tableCell, styles.colTax]}>{item.tax}%</Text>
            <Text style={[styles.tableCell, styles.colAmount, styles.right]}>
              {formatCurrency(convertIntToDecimal(item.total))}
            </Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>{formatCurrency(convertIntToDecimal(subtotal))}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text>Tax</Text>
          <Text>{formatCurrency(convertIntToDecimal(taxedAmount))}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>
            {formatCurrency(convertIntToDecimal(total))}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);
