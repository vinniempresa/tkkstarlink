export function getDeliveryDateRange(): string {
  const today = new Date();
  
  // Data mínima: hoje + 3 dias
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 3);
  
  // Data máxima: hoje + 4 dias
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 4);
  
  // Formata as datas no padrão brasileiro: DD de MMM
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const month = months[date.getMonth()];
    return `${day} de ${month}`;
  };
  
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
}
