import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "./AdminLayout";
import { Users } from "lucide-react";
import type { Customer } from "@shared/schema";

export default function Customers() {
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Carregando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-black">Clientes</h1>

        <Card>
          <CardContent className="p-0">
            {!customers || customers.length === 0 ? (
              <div className="py-16 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Nenhum cliente cadastrado
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Os clientes aparecerão aqui quando realizarem compras em suas lojas
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Integração com API da 4mpagamentos em desenvolvimento
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Total de Compras</TableHead>
                    <TableHead>Pedidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || "-"}</TableCell>
                      <TableCell>R$ {customer.totalPurchases}</TableCell>
                      <TableCell>{customer.ordersCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
