import { useState } from 'react';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';
import SupplierForm from './components/SupplierForm.jsx';
import SupplierList from './components/SupplierList.jsx';

export default function App() {
  const [productsRefresh, setProductsRefresh] = useState(0);
  const [suppliersRefresh, setSuppliersRefresh] = useState(0);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h1>StockAR</h1>

      <section>
        <h2>Nuevo proveedor</h2>
        <SupplierForm onCreated={() => setSuppliersRefresh((n) => n + 1)} />

        <h2>Proveedores</h2>
        <SupplierList refreshTrigger={suppliersRefresh} />
      </section>

      <section>
        <h2>Nuevo producto</h2>
        <ProductForm
          onCreated={() => setProductsRefresh((n) => n + 1)}
          suppliersRefreshTrigger={suppliersRefresh}
        />

        <h2>Productos</h2>
        <ProductList refreshTrigger={productsRefresh} />
      </section>
    </main>
  );
}
