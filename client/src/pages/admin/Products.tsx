import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Eye, Package, ExternalLink } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function Products() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
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
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Produtos</h1>
          <Link href="/products/new">
            <Button 
              data-testid="button-new-product"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products?.map((product) => (
            <Card key={product.id} data-testid={`card-product-${product.id}`}>
              <CardHeader className="p-4 pb-3">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-36 object-cover rounded-sm mb-3"
                />
                <CardTitle className="text-sm font-semibold text-black line-clamp-2">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Preço:</span>
                    <span className="font-bold text-black">
                      R$ {product.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Estoque:</span>
                    <span className="text-black">{product.stock} unidades</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Avaliação:</span>
                    <span className="text-black">⭐ {product.rating}</span>
                  </div>
                  <div className="flex justify-end gap-1 mt-3">
                    <Link href={`/product/${product.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-public-${product.id}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/products/${product.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-view-${product.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/products/${product.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-edit-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir este produto?")) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                      data-testid={`button-delete-${product.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!products || products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum produto cadastrado</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Comece adicionando seu primeiro produto para vender na TikTok Shop
              </p>
              <Link href="/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Produto
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AdminLayout>
  );
}
