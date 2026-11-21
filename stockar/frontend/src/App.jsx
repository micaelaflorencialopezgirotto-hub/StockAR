import { useState } from 'react';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h1>StockAR</h1>

      <h2>Nuevo producto</h2>
      <ProductForm onCreated={() => setRefreshTrigger((n) => n + 1)} />

      <h2>Productos</h2>
      <ProductList refreshTrigger={refreshTrigger} />
    </main>
  );
}
