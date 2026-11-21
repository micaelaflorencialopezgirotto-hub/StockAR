import { useEffect, useState } from 'react';
import { getAll as getMovements } from '../services/movements.service.js';
import { getAll as getProducts } from '../services/products.service.js';
import { getAll as getWarehouses } from '../services/warehouses.service.js';
import MovementForm from '../components/MovementForm.jsx';
import MovementsTable from '../components/MovementsTable.jsx';
import {
  MOVEMENT_TYPES,
  PageHeader,
  Panel,
  SectionHeader,
  SelectIcon,
  card,
  errorClass,
  errorMessage,
  mutedText,
  primaryButton,
  selectClass,
} from '../components/ui.jsx';

const byDateDesc = (a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora);

export default function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [tipoFilter, setTipoFilter] = useState(''); // '' = todos
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Productos y depósitos: para el formulario y para mostrar el producto de cada movimiento.
  // Se recargan al registrar un movimiento porque cambia el stock.
  useEffect(() => {
    let cancelled = false;
    setOptionsError(null);
    Promise.all([getProducts(), getWarehouses()])
      .then(([productsData, warehousesData]) => {
        if (cancelled) return;
        setProducts(productsData);
        setWarehouses(warehousesData);
      })
      .catch((err) => {
        if (!cancelled) setOptionsError(errorMessage(err, 'No se pudieron cargar productos y depósitos'));
      });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getMovements(tipoFilter ? { tipo: tipoFilter } : undefined)
      .then((data) => {
        if (!cancelled) setMovements([...data].sort(byDateDesc));
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err, 'No se pudo cargar la lista de movimientos'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refresh, tipoFilter]);

  const productsById = Object.fromEntries(products.map((p) => [p.id, p]));

  let content;
  if (loading) content = <p className={mutedText}>Cargando movimientos…</p>;
  else if (error) content = <p className={errorClass}>{error}</p>;
  else if (movements.length === 0) {
    content = (
      <p className={`${card} p-space-lg text-center ${mutedText}`}>
        {tipoFilter ? `No hay movimientos de tipo "${MOVEMENT_TYPES[tipoFilter].label}".` : 'No hay movimientos registrados.'}
      </p>
    );
  } else content = <MovementsTable movements={movements} productsById={productsById} />;

  return (
    <div>
      <PageHeader
        title="Movimientos"
        description="Kárdex de entradas, salidas, ajustes y reservas del depósito propio. Los movimientos no se editan ni se borran: para corregir, registrá un ajuste."
        actions={
          <button type="button" onClick={() => setShowForm(true)} className={primaryButton}>
            <span className="material-symbols-outlined text-[18px]">add</span>
            Registrar movimiento
          </button>
        }
      />

      {showForm && (
        <Panel title="Registrar movimiento" icon="swap_horiz" onClose={() => setShowForm(false)}>
          {optionsError && <p className={`mb-space-md ${errorClass}`}>{optionsError}</p>}
          <MovementForm products={products} warehouses={warehouses} onSaved={() => setRefresh((n) => n + 1)} />
        </Panel>
      )}

      <SectionHeader
        title="Historial"
        actions={
          <label className="flex items-center gap-space-sm">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Tipo</span>
            <span className="relative">
              <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} className={`${selectClass} w-auto`}>
                <option value="">Todos</option>
                {Object.entries(MOVEMENT_TYPES).map(([value, t]) => (
                  <option key={value} value={value}>{t.label}</option>
                ))}
              </select>
              <SelectIcon />
            </span>
          </label>
        }
      />
      {content}
    </div>
  );
}
