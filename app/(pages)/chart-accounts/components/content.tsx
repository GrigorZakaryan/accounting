import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartAccount } from "@/lib/generated/prisma";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";

export const CoAContent = async ({ CoAs }: { CoAs: ChartAccount[] }) => {
  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="font-medium text-lg">
            List of CoAs{" "}
            <span className="text-muted-foreground font-normal text-md">
              {"(Chart of Accounts)"}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your CoAs here.
          </p>
        </div>
        <Link className="cursor-pointer" href={"/chart-accounts/create"}>
          <Button className="cursor-pointer">
            <Plus /> Create CoA
          </Button>
        </Link>
      </div>
      <Card className="mt-5">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>IsSystem</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CoAs.map((CoA) => (
                <TableRow key={CoA.id}>
                  <TableCell>#{CoA.code}</TableCell>
                  <TableCell>{CoA.name}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        CoA.type === "ASSET" &&
                        "bg-cyan-100 border-cyan-400 text-cyan-900"
                      }
                      ${
                        CoA.type === "LIABILITY" &&
                        "bg-amber-100 border-amber-400 text-amber-900"
                      }
                      ${
                        CoA.type === "EQUITY" &&
                        "bg-violet-100 border-violet-400 text-violet-900"
                      }
                      ${
                        CoA.type === "EXPENSE" &&
                        "bg-red-100 border-red-400 text-red-900"
                      }
                      ${
                        CoA.type === "INCOME" &&
                        "bg-green-100 border-green-400 text-green-900"
                      }
                      `}
                    >
                      {CoA.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 border border-green-400">
                      {CoA.isSystem ? "TRUE" : "FALSE"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <MoreHorizontal className="w-5 h-5" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
