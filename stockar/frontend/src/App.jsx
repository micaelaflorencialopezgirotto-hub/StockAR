import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PriceComparison from './components/PriceComparison.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MovementsPage from './pages/MovementsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
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
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/productos" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/movimientos" element={<MovementsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />

        <Route
          path="/proveedores"
          element={
            <section>
              <h2 id="supplier-form" className="mb-space-md scroll-mt-20 font-headline-lg text-headline-lg text-on-surface">{editingSupplier ? `Editar proveedor: ${editingSupplier.razon_social}` : 'Nuevo proveedor'}</h2>
              <SupplierForm
                supplier={editingSupplier}
                onSaved={() => {
                  setEditingSupplier(null);
                  refreshSuppliers();
                }}
                onCancel={() => setEditingSupplier(null)}
              />

              <h2 className="mb-space-md mt-space-xl font-headline-lg text-headline-lg text-on-surface">Proveedores</h2>
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

              <h2 className="mb-space-xs mt-space-xl font-headline-lg text-headline-lg text-on-surface">Comparador de precios</h2>
              <p className="mb-space-md font-body-md text-body-md text-on-surface-variant">
                Precio de lista y disponibilidad que informa cada proveedor, por producto.
              </p>
              <PriceComparison refreshTrigger={suppliersRefresh} />
            </section>
          }
        />

        <Route
          path="/productos"
          element={
            <section>
              <h2 id="product-form" className="mb-space-md scroll-mt-20 font-headline-lg text-headline-lg text-on-surface">{editingProduct ? `Editar producto: ${editingProduct.nombre}` : 'Nuevo producto'}</h2>
              <ProductForm
                product={editingProduct}
                onSaved={() => {
                  setEditingProduct(null);
                  refreshProducts();
                }}
                onCancel={() => setEditingProduct(null)}
                suppliersRefreshTrigger={suppliersRefresh}
              />

              <h2 className="mb-space-md mt-space-xl font-headline-lg text-headline-lg text-on-surface">Productos</h2>
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
          }
        />
      </Route>
    </Routes>
  );
}
