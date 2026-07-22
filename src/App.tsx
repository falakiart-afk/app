import React, { useState, useEffect } from 'react';
import { Order } from './types';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

const STORAGE_KEY = 'casart_orders_v1';

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'CAS-294-MA',
    name: 'Mohamed Amraoui',
    phone: '0612345678',
    city: 'rabat',
    address: 'Avenue Mohammed V, Appt 4',
    quantity: 1,
    totalPrice: 249,
    status: 'delivered',
    createdAt: '2026-07-08T12:00:00.000Z'
  },
  {
    id: 'CAS-739-MA',
    name: 'Fouad Naciri',
    phone: '0722334455',
    city: 'casablanca',
    address: 'Rue de la Gironde, No 12',
    quantity: 2,
    totalPrice: 399,
    status: 'shipped',
    createdAt: '2026-07-09T14:30:00.000Z'
  },
  {
    id: 'CAS-415-MA',
    name: 'Fatima Zahra Tazi',
    phone: '0644556677',
    city: 'fes',
    address: 'Quartier Narjiss, Villa 3',
    quantity: 1,
    totalPrice: 249,
    status: 'pending',
    createdAt: '2026-07-10T18:15:00.000Z'
  }
];

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('cpanel_is_authenticated') === 'true' || 
           sessionStorage.getItem('cpanel_is_authenticated') === 'true';
  });

  // Initialize and load orders from localStorage on load
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setOrders(JSON.parse(cached));
      } catch (e) {
        setOrders(INITIAL_DEMO_ORDERS);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      setOrders(INITIAL_DEMO_ORDERS);
    }
  }, []);

  // Save orders helper
  const saveOrders = (updatedOrders: Order[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
  };

  // Update entire order details handler
  const handleUpdateOrder = (updatedOrder: Order) => {
    const nextOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    saveOrders(nextOrders);
  };

  // Add new order handler
  const handleAddOrder = (newOrder: Order) => {
    const nextOrders = [newOrder, ...orders];
    saveOrders(nextOrders);
  };

  // Update order status handler
  const handleStatusChange = (id: string, status: Order['status']) => {
    const nextOrders = orders.map(o => o.id === id ? { ...o, status } : o);
    saveOrders(nextOrders);
  };

  // Delete order handler
  const handleDeleteOrder = (id: string) => {
    if (window.confirm(`Are you sure you want to delete order ${id}?`)) {
      const nextOrders = orders.filter(o => o.id !== id);
      saveOrders(nextOrders);
    }
  };

  // Reset demo orders handler
  const handleResetDemo = () => {
    if (window.confirm('Reset local storage and re-populate with 3 default demo Moroccan orders?')) {
      saveOrders(INITIAL_DEMO_ORDERS);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cpanel_is_authenticated');
    sessionStorage.removeItem('cpanel_is_authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0D0E11] text-[#E0E0E0] flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      <main className="flex-1">
        <AdminPanel 
          orders={orders}
          onStatusChange={handleStatusChange}
          onUpdateOrder={handleUpdateOrder}
          onAddOrder={handleAddOrder}
          onDeleteOrder={handleDeleteOrder}
          onResetDemo={handleResetDemo}
          onLogout={handleLogout}
        />
      </main>
    </div>
  );
}
