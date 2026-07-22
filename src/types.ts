export interface Order {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
  productName?: string;
}

export interface City {
  id: string;
  nameEn: string;
  nameFr: string;
  nameAr: string;
}
