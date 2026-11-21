import { useState } from 'react';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';
import SupplierForm from './components/SupplierForm.jsx';
import SupplierList from './components/SupplierList.jsx';

export default function App() {
  const [productsRefresh, setProductsRefresh] = useState(0);
  const [suppliersRefresh, setSuppliersRefresh] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const refreshProducts = () => setProductsRefresh((n) => n + 1);
  const refreshSuppliers = () => setSuppliersRefresh((n) => n + 1);

  // Al elegir "Editar", lleva la vista al formulario correspondiente.
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h1>StockAR</h1>

      <section>
        <h2 id="supplier-form">{editingSupplier ? `Editar proveedor: ${editingSupplier.razon_social}` : 'Nuevo proveedor'}</h2>
        <SupplierForm
          supplier={editingSupplier}
          onSaved={() => {
            setEditingSupplier(null);
            refreshSuppliers();
          }}
          onCancel={() => setEditingSupplier(null)}
        />

        <h2>Proveedores</h2>
        <SupplierList
          refreshTrigger={suppliersRefresh}
          onEdit={(supplier) => {
            setEditingSupplier(supplier);
            scrollTo('supplier-form');
          }}
          onDeleted={(supplier) => {
            if (editingSupplier?.id === supplier.id) setEditingSupplier(null);
            refreshSuppliers();
          }}
        />
      </section>

      <section>
        <h2 id="product-form">{editingProduct ? `Editar producto: ${editingProduct.nombre}` : 'Nuevo producto'}</h2>
        <ProductForm
          product={editingProduct}
          onSaved={() => {
            setEditingProduct(null);
            refreshProducts();
          }}
          onCancel={() => setEditingProduct(null)}
          suppliersRefreshTrigger={suppliersRefresh}
        />

        <h2>Productos</h2>
        <ProductList
          refreshTrigger={productsRefresh}
          onEdit={(product) => {
            setEditingProduct(product);
            scrollTo('product-form');
          }}
          onDeleted={(product) => {
            if (editingProduct?.id === product.id) setEditingProduct(null);
            refreshProducts();
          }}
        />
      </section>
    </main>
  );
}
