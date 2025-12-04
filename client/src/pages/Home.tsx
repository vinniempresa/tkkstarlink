import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (products && products.length > 0) {
      setLocation(`/product/${products[0].id}`);
    }
  }, [products, setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="text-xl text-black">Carregando...</div>
      </div>
    </div>
  );
}
