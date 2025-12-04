import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Globe, Link2 } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { useState } from "react";
import type { Domain } from "@shared/schema";

export default function Domains() {
  const [newDomain, setNewDomain] = useState("");

  const { data: domains, isLoading } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  const createMutation = useMutation({
    mutationFn: async (domain: string) => {
      return apiRequest("POST", "/api/domains", { domain, isActive: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      setNewDomain("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/domains/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
    },
  });

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      createMutation.mutate(newDomain.trim());
    }
  };

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
        <h1 className="text-xl font-bold text-black">Domínios</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-black">Adicionar Novo Domínio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="exemplo.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddDomain()}
                data-testid="input-domain"
              />
              <Button
                onClick={handleAddDomain}
                disabled={createMutation.isPending}
                data-testid="button-add-domain"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains?.map((domain) => (
            <Card key={domain.id} data-testid={`card-domain-${domain.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" style={{ color: '#009995' }} />
                    <div>
                      <p className="font-medium text-black">{domain.domain}</p>
                      <p className="text-xs text-gray-500">
                        {domain.isActive ? "Ativo" : "Inativo"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir este domínio?")) {
                        deleteMutation.mutate(domain.id);
                      }
                    }}
                    data-testid={`button-delete-${domain.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!domains || domains.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum domínio configurado
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Adicione domínios personalizados para suas lojas da TikTok Shop
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AdminLayout>
  );
}
