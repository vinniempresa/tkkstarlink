import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProductPage from "@/pages/ProductPage";
import ProductView from "@/pages/ProductView";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentPage from "@/pages/PaymentPage";
import TaxaPage from "@/pages/TaxaPage";
import AcompanhamentoPage from "@/pages/AcompanhamentoPage";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import ProductForm from "@/pages/admin/ProductForm";
import Customers from "@/pages/admin/Customers";
import Domains from "@/pages/admin/Domains";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Funil sem slug */}
      <Route path="/" component={ProductPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/pagamento" component={PaymentPage} />
      <Route path="/taxa" component={TaxaPage} />
      <Route path="/acompanhamento" component={AcompanhamentoPage} />
      
      {/* Funil com slug /oferta */}
      <Route path="/oferta" component={ProductPage} />
      <Route path="/oferta/checkout" component={CheckoutPage} />
      <Route path="/oferta/pagamento" component={PaymentPage} />
      <Route path="/oferta/taxa" component={TaxaPage} />
      <Route path="/oferta/acompanhamento" component={AcompanhamentoPage} />
      
      {/* Admin */}
      <Route path="/product/:id" component={ProductView} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/products/new" component={ProductForm} />
      <Route path="/products/:id/edit" component={ProductForm} />
      <Route path="/products" component={Products} />
      <Route path="/customers" component={Customers} />
      <Route path="/domains" component={Domains} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
