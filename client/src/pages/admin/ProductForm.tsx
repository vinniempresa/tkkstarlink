import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash2, Star, Upload, Package, Image, MessageSquare, Settings } from 'lucide-react';
import type { Product, InsertProduct, Review } from '@shared/schema';

export default function ProductForm() {
  const [, params] = useRoute('/products/:id/edit');
  const [, setLocation] = useLocation();
  const isEditing = !!params?.id;

  // Estado do formulário (usando any para armazenar strings temporariamente)
  const [formData, setFormData] = useState<any>({
    storeId: 'b4e7ba77-b2c0-46c3-8087-9dd5b25fdb23', // ID da loja padrão
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: 0,
    mainImage: 'https://via.placeholder.com/400',
    images: [],
    variant: 'Vermelho',
    variantImage: 'https://via.placeholder.com/100',
    stock: 100,
    rating: '5.0',
    reviewsCount: 0,
    salesCount: 0,
    deliveryFee: '9.90',
    installments: 2,
    couponDiscount: 10,
    couponMinValue: '39.00',
    couponMaxDiscount: '25.00',
  });

  // Estado das avaliações
  const [reviews, setReviews] = useState<Partial<Review>[]>([]);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    variant: 'Vermelho',
    comment: '',
    image: ''
  });

  // Estado das variantes
  const [variants, setVariants] = useState<Array<{name: string; image: string; quantity: number}>>([
    { name: 'Vermelho', image: 'https://via.placeholder.com/100', quantity: 100 }
  ]);

  // Buscar produto se estiver editando
  const { data: product } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
    enabled: isEditing
  });

  // Buscar avaliações do produto
  const { data: productReviews } = useQuery<Review[]>({
    queryKey: [`/api/products/${params?.id}/reviews`],
    enabled: isEditing
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        deliveryFee: product.deliveryFee?.toString() || '9.90',
        couponMinValue: product.couponMinValue?.toString() || '39.00',
        couponMaxDiscount: product.couponMaxDiscount?.toString() || '25.00',
        rating: product.rating?.toString() || '5.0'
      });
      
      if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
        setVariants(product.variants.map(v => ({
          name: v.name,
          image: v.image,
          quantity: v.quantity
        })));
      } else if (product.variant && product.variantImage) {
        setVariants([{
          name: product.variant,
          image: product.variantImage,
          quantity: product.stock || 100
        }]);
      }
    }
  }, [product]);

  useEffect(() => {
    if (productReviews) {
      setReviews(productReviews);
    }
  }, [productReviews]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Criar produto
      const productRes = await apiRequest('POST', '/api/products', data.product);
      const product = await productRes.json();
      
      console.log('Product created:', product);
      
      // Garantir que o produto foi criado e tem ID válido
      if (!product || !product.id) {
        throw new Error('Produto não foi criado corretamente - ID não retornado');
      }
      
      // Criar avaliações apenas se o produto foi criado com sucesso
      if (data.reviews && data.reviews.length > 0) {
        for (const review of data.reviews) {
          // Garantir que todos os campos obrigatórios estão presentes
          const reviewData = {
            productId: product.id,
            customerName: review.customerName || '',
            rating: typeof review.rating === 'number' ? review.rating : (parseInt(review.rating) || 5),
            variant: review.variant || 'Vermelho',
            comment: review.comment || '',
            image: review.image || undefined
          };
          console.log('Sending review:', reviewData);
          try {
            await apiRequest('POST', '/api/reviews', reviewData);
            console.log('Review created successfully');
          } catch (error) {
            console.error('Error creating review:', error);
            throw error;
          }
        }
      }
      
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setLocation('/products');
    },
    onError: (error: Error) => {
      console.error('Error creating product:', error);
      alert(`Erro ao criar produto: ${error.message}\n\nVerifique se todos os campos obrigatórios estão preenchidos.`);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('PATCH', `/api/products/${params?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${params?.id}`] });
      setLocation('/products');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação frontend - campos obrigatórios
    if (!formData.name || formData.name.trim() === '') {
      alert('❌ Nome do produto é obrigatório!');
      return;
    }
    
    if (!formData.description || formData.description.trim() === '') {
      alert('❌ Descrição do produto é obrigatória!');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('❌ Preço do produto é obrigatório e deve ser maior que zero!');
      return;
    }
    
    if (!formData.mainImage || formData.mainImage === 'https://via.placeholder.com/400') {
      alert('❌ Imagem principal do produto é obrigatória!');
      return;
    }
    
    // Validar variantes
    if (variants.length === 0) {
      alert('❌ Adicione pelo menos uma variante!');
      return;
    }
    
    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].name || variants[i].name.trim() === '') {
        alert(`❌ Variante ${i + 1}: Nome é obrigatório!`);
        return;
      }
      if (!variants[i].image || variants[i].image.trim() === '') {
        alert(`❌ Variante ${i + 1}: Imagem é obrigatória!`);
        return;
      }
    }

    // Converter strings para os tipos corretos
    const productData: any = {
      ...formData,
      price: formData.price || '0',
      originalPrice: formData.originalPrice || formData.price || '0',
      discount: parseInt(formData.discount) || 0,
      stock: parseInt(formData.stock) || 100,
      reviewsCount: parseInt(formData.reviewsCount) || 0,
      salesCount: parseInt(formData.salesCount) || 0,
      installments: parseInt(formData.installments) || 2,
      couponDiscount: parseInt(formData.couponDiscount) || 10,
      rating: formData.rating || '5.0',
      deliveryFee: formData.deliveryFee || '9.90',
      couponMinValue: formData.couponMinValue || '39.00',
      couponMaxDiscount: formData.couponMaxDiscount || '25.00',
      images: formData.images?.length ? formData.images : [],
      mainImage: formData.mainImage || 'https://via.placeholder.com/400',
      variants: variants.map(v => ({
        name: v.name,
        image: v.image,
        quantity: parseInt(v.quantity.toString()) || 100
      }))
    };

    // Remover campos legados de variante
    delete productData.variant;
    delete productData.variantImage;
    
    // Remover campos de timestamp que são gerenciados pelo banco de dados
    delete productData.createdAt;
    delete productData.updatedAt;
    delete productData.id; // Não enviar ID no body, já está na URL

    if (isEditing) {
      updateMutation.mutate(productData);
    } else {
      createMutation.mutate({
        product: productData,
        reviews: reviews
      });
    }
  };

  const handleAddReview = () => {
    if (newReview.customerName && newReview.comment) {
      setReviews([...reviews, { ...newReview, rating: newReview.rating }]);
      setNewReview({
        customerName: '',
        rating: 5,
        variant: 'Vermelho',
        comment: '',
        image: ''
      });
      
      // Atualizar rating médio
      const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) + newReview.rating;
      const avgRating = (totalRating / (reviews.length + 1)).toFixed(1);
      setFormData(prev => ({ ...prev, rating: avgRating, reviewsCount: reviews.length + 1 }));
    }
  };

  const handleRemoveReview = (index: number) => {
    const newReviewsList = reviews.filter((_, i) => i !== index);
    setReviews(newReviewsList);
    
    // Recalcular rating médio
    if (newReviewsList.length > 0) {
      const totalRating = newReviewsList.reduce((sum, r) => sum + (r.rating || 0), 0);
      const avgRating = (totalRating / newReviewsList.length).toFixed(1);
      setFormData(prev => ({ ...prev, rating: avgRating, reviewsCount: newReviewsList.length }));
    } else {
      setFormData(prev => ({ ...prev, rating: '5.0', reviewsCount: 0 }));
    }
  };

  const handleAddImage = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', image: '', quantity: 100 }]);
  };

  const handleUpdateVariant = (index: number, field: 'name' | 'image' | 'quantity', value: string | number) => {
    const updated = [...variants];
    if (field === 'quantity') {
      updated[index][field] = typeof value === 'string' ? parseInt(value) || 0 : value;
    } else {
      updated[index][field] = value as string;
    }
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    } else {
      alert('Deve haver pelo menos uma variante!');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/products')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-xl font-bold text-black">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" style={{ color: '#0fd9d0' }} />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  data-testid="input-name"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                  data-testid="input-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                    data-testid="input-price"
                  />
                </div>

                <div>
                  <Label htmlFor="originalPrice">Preço Original (R$)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    data-testid="input-original-price"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Estoque *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                    required
                    data-testid="input-stock"
                  />
                </div>

                <div>
                  <Label htmlFor="discount">Desconto (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: parseInt(e.target.value) }))}
                    data-testid="input-discount"
                  />
                </div>
              </div>

            </CardContent>
          </Card>
          
          {/* Variantes do Produto */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5" style={{ color: '#0fd9d0' }} />
                  Variantes do Produto
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVariant}
                  data-testid="button-add-variant"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Variante
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {variants.map((variant, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Variante {index + 1}</span>
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariant(index)}
                          data-testid={`button-remove-variant-${index}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`variant-name-${index}`}>Nome *</Label>
                      <Input
                        id={`variant-name-${index}`}
                        value={variant.name}
                        onChange={(e) => handleUpdateVariant(index, 'name', e.target.value)}
                        placeholder="Ex: Vermelho, Azul, Tamanho M"
                        required
                        data-testid={`input-variant-name-${index}`}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`variant-image-${index}`}>Imagem (URL) *</Label>
                      <Input
                        id={`variant-image-${index}`}
                        type="url"
                        value={variant.image}
                        onChange={(e) => handleUpdateVariant(index, 'image', e.target.value)}
                        placeholder="https://exemplo.com/variante.jpg"
                        required
                        data-testid={`input-variant-image-${index}`}
                      />
                      {variant.image && (
                        <img 
                          src={variant.image} 
                          alt={`Preview ${variant.name}`}
                          className="mt-2 w-full h-24 object-cover rounded-sm border"
                        />
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor={`variant-quantity-${index}`}>Quantidade</Label>
                      <Input
                        id={`variant-quantity-${index}`}
                        type="number"
                        value={variant.quantity}
                        onChange={(e) => handleUpdateVariant(index, 'quantity', e.target.value)}
                        min="0"
                        data-testid={`input-variant-quantity-${index}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Imagens */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="w-5 h-5" style={{ color: '#0fd9d0' }} />
                Imagens do Produto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mainImage">Imagem Principal (URL) *</Label>
                <Input
                  id="mainImage"
                  type="url"
                  value={formData.mainImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mainImage: e.target.value }))}
                  required
                  placeholder="https://exemplo.com/imagem.jpg"
                  data-testid="input-main-image"
                />
                {formData.mainImage && (
                  <img 
                    src={formData.mainImage} 
                    alt="Preview Principal" 
                    className="mt-2 w-full h-32 object-cover rounded-sm border"
                  />
                )}
              </div>

              {/* Imagens adicionais */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Imagens Adicionais</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImage}
                    data-testid="button-add-image"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.images?.map((img, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={img}
                        readOnly
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        data-testid={`button-remove-image-${index}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Avaliações */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" style={{ color: '#0fd9d0' }} />
                  Avaliações do Produto
                </span>
                <span className="text-sm font-normal text-gray-600">
                  {reviews.length} avaliações | Média: ⭐ {formData.rating || '5.0'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Formulário para adicionar avaliação */}
              <div className="bg-gray-50 p-4 rounded-sm mb-4">
                <h4 className="font-semibold mb-3">Adicionar Nova Avaliação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Nome do Cliente</Label>
                    <Input
                      value={newReview.customerName}
                      onChange={(e) => setNewReview(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="João Silva"
                      data-testid="input-review-name"
                    />
                  </div>
                  
                  <div>
                    <Label>Avaliação</Label>
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`p-1 ${star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          data-testid={`button-star-${star}`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Variante</Label>
                    <Input
                      value={newReview.variant}
                      onChange={(e) => setNewReview(prev => ({ ...prev, variant: e.target.value }))}
                      placeholder="Vermelho"
                      data-testid="input-review-variant"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Comentário</Label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Produto excelente, recomendo!"
                      rows={2}
                      data-testid="input-review-comment"
                    />
                  </div>

                  <div>
                    <Label>Imagem (URL)</Label>
                    <Input
                      value={newReview.image}
                      onChange={(e) => setNewReview(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://..."
                      data-testid="input-review-image"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAddReview}
                  className="mt-4 bg-primary hover:bg-primary/90"
                  data-testid="button-add-review"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Avaliação
                </Button>
              </div>

              {/* Lista de avaliações */}
              <div className="space-y-3">
                {reviews.map((review, index) => (
                  <div key={index} className="border rounded-sm p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.customerName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < (review.rating || 5) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">• {review.variant}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                      {review.image && (
                        <img 
                          src={review.image} 
                          alt="Review" 
                          className="w-20 h-20 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveReview(index)}
                      data-testid={`button-remove-review-${index}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                
                {reviews.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Nenhuma avaliação adicionada ainda
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configurações Avançadas */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" style={{ color: '#0fd9d0' }} />
                Configurações Avançadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    step="0.01"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryFee: e.target.value }))}
                    data-testid="input-delivery-fee"
                  />
                </div>

                <div>
                  <Label htmlFor="installments">Parcelas</Label>
                  <Input
                    id="installments"
                    type="number"
                    value={formData.installments}
                    onChange={(e) => setFormData(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
                    data-testid="input-installments"
                  />
                </div>

                <div>
                  <Label htmlFor="salesCount">Vendas Realizadas</Label>
                  <Input
                    id="salesCount"
                    type="number"
                    value={formData.salesCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, salesCount: parseInt(e.target.value) }))}
                    data-testid="input-sales-count"
                  />
                </div>

                <div>
                  <Label htmlFor="couponDiscount">Desconto Cupom (%)</Label>
                  <Input
                    id="couponDiscount"
                    type="number"
                    value={formData.couponDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, couponDiscount: parseInt(e.target.value) }))}
                    data-testid="input-coupon-discount"
                  />
                </div>

                <div>
                  <Label htmlFor="couponMinValue">Valor Mínimo Cupom (R$)</Label>
                  <Input
                    id="couponMinValue"
                    type="number"
                    step="0.01"
                    value={formData.couponMinValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, couponMinValue: e.target.value }))}
                    data-testid="input-coupon-min-value"
                  />
                </div>

                <div>
                  <Label htmlFor="couponMaxDiscount">Desconto Máximo Cupom (R$)</Label>
                  <Input
                    id="couponMaxDiscount"
                    type="number"
                    step="0.01"
                    value={formData.couponMaxDiscount}
                    onChange={(e) => setFormData(prev => ({ ...prev, couponMaxDiscount: e.target.value }))}
                    data-testid="input-coupon-max-discount"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/products')}
              data-testid="button-cancel"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#0fd9d0] hover:bg-[#0fd9d0]/90 text-white border-transparent"
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-save"
            >
              <Save className="w-4 h-4 mr-2" />
              {createMutation.isPending || updateMutation.isPending
                ? 'Salvando...'
                : isEditing
                ? 'Salvar Alterações'
                : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}