import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";
import AdminLayout from "./AdminLayout";

export default function Dashboard() {
  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: customers } = useQuery({
    queryKey: ["/api/customers"],
  });

  const totalProducts = Array.isArray(products) ? products.length : 0;
  const totalCustomers = Array.isArray(customers) ? customers.length : 0;
  const totalRevenue = Array.isArray(customers) 
    ? customers.reduce((sum: number, customer: any) => 
        sum + parseFloat(customer.totalPurchases || 0), 0) 
    : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-black">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="card-revenue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Faturamento Total
              </CardTitle>
              <DollarSign className="w-4 h-4" style={{ color: '#009995' }} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-black" data-testid="text-revenue">
                R$ {totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Integração com 4mpagamentos em breve
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-products">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Produtos
              </CardTitle>
              <Package className="w-4 h-4" style={{ color: '#009995' }} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-black" data-testid="text-products-count">
                {totalProducts}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Produtos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-customers">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Clientes
              </CardTitle>
              <Users className="w-4 h-4" style={{ color: '#009995' }} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-black" data-testid="text-customers-count">
                {totalCustomers}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-growth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Crescimento
              </CardTitle>
              <TrendingUp className="w-4 h-4" style={{ color: '#009995' }} />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-black">+12%</div>
              <p className="text-xs text-gray-500 mt-1">
                Vs. mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-black">Bem-vindo à Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Esta é sua plataforma de criação de lojas TikTok Shop. Gerencie seus produtos,
              clientes e domínios de forma simples e eficiente. A integração com a API da
              4mpagamentos será implementada em breve para exibir dados de faturamento em tempo real.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
