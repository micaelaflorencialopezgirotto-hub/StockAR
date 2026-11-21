import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import PriceComparison from './components/PriceComparison.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import MovementsPage from './pages/MovementsPage.jsx';
import PriceListsPage from './pages/PriceListsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductForm from './components/ProductForm.jsx';
import ProductList from './components/ProductList.jsx';
import SupplierForm from './components/SupplierForm.jsx';
import SupplierList from './components/SupplierList.jsx';
import { PageHeader, Panel, SectionHeader, primaryButton } from './components/ui.jsx';

function NewButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={primaryButton}>
      <span className="material-symbols-outlined text-[18px]">add</span>
      {children}
    </button>
  );
}

export default function App() {
  const [productsRefresh, setProductsRefresh] = useState(0);
  const [suppliersRefresh, setSuppliersRefresh] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  // Los formularios de alta quedan plegados hasta tocar "Nuevo …"; al editar se abren solos.
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [creatingSupplier, setCreatingSupplier] = useState(false);

  const refreshProducts = () => setProductsRefresh((n) => n + 1);
  const refreshSuppliers = () => setSuppliersRefresh((n) => n + 1);

  // Al abrir un formulario, lleva la vista hasta él (después de que se renderiza).
  const scrollTo = (id) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0);

  const closeProductForm = () => {
    setEditingProduct(null);
    setCreatingProduct(false);
  };
  const closeSupplierForm = () => {
    setEditingSupplier(null);
    setCreatingSupplier(false);
  };

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/productos" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/movimientos" element={<MovementsPage />} />
        <Route path="/listas-precios" element={<PriceListsPage />} />
        <Route path="/productos/:id" element={<ProductDetailPage />} />

        <Route
          path="/proveedores"
          element={
            <section>
              <PageHeader
                title="Proveedores"
                description="Directorio de proveedores y comparación de sus precios de lista."
                actions={
                  <NewButton
                    onClick={() => {
                      setEditingSupplier(null);
                      setCreatingSupplier(true);
                      scrollTo('supplier-form');
                    }}
                  >
                    Nuevo proveedor
                  </NewButton>
                }
              />

              {(creatingSupplier || editingSupplier) && (
                <div id="supplier-form" className="scroll-mt-24">
                  <Panel
                    title={editingSupplier ? `Editar proveedor: ${editingSupplier.razon_social}` : 'Nuevo proveedor'}
                    icon={editingSupplier ? 'edit' : 'person_add'}
                    onClose={closeSupplierForm}
                  >
                    <SupplierForm
                      supplier={editingSupplier}
                      onSaved={() => {
                        closeSupplierForm();
                        refreshSuppliers();
                      }}
                      onCancel={closeSupplierForm}
                    />
                  </Panel>
                </div>
              )}

              <SupplierList
                refreshTrigger={suppliersRefresh}
                onEdit={(supplier) => {
                  setCreatingSupplier(false);
                  setEditingSupplier(supplier);
                  scrollTo('supplier-form');
                }}
                onDeleted={(supplier) => {
                  if (editingSupplier?.id === supplier.id) setEditingSupplier(null);
                  refreshSuppliers();
                }}
              />

              <div className="mt-space-xl">
                <SectionHeader
                  title="Comparador de precios"
                  description="Precio de lista y disponibilidad que informa cada proveedor, por producto."
                />
                <PriceComparison refreshTrigger={suppliersRefresh} />
              </div>
            </section>
          }
        />

        <Route
          path="/productos"
          element={
            <section>
              <PageHeader
                title="Productos"
                description="Catálogo con el stock del depósito propio, precio de venta y estado de cada artículo."
                actions={
                  <NewButton
                    onClick={() => {
                      setEditingProduct(null);
                      setCreatingProduct(true);
                      scrollTo('product-form');
                    }}
                  >
                    Nuevo producto
                  </NewButton>
                }
              />

              {(creatingProduct || editingProduct) && (
                <div id="product-form" className="scroll-mt-24">
                  <Panel
                    title={editingProduct ? `Editar producto: ${editingProduct.nombre}` : 'Nuevo producto'}
                    icon={editingProduct ? 'edit' : 'add_box'}
                    onClose={closeProductForm}
                  >
                    <ProductForm
                      product={editingProduct}
                      onSaved={() => {
                        closeProductForm();
                        refreshProducts();
                      }}
                      onCancel={closeProductForm}
                      suppliersRefreshTrigger={suppliersRefresh}
                    />
                  </Panel>
                </div>
              )}

              <ProductList
                refreshTrigger={productsRefresh}
                onEdit={(product) => {
                  setCreatingProduct(false);
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
