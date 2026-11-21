import { useCallback, useEffect, useRef, useState } from 'react';

// Diálogo de confirmación con el estilo de modal de DESIGN.md (nivel 3): tarjeta blanca,
// borde fino, sombra estructural suave y fondo oscurecido con desenfoque de 2px.
// Usa <dialog> nativo: atrapa el foco, se cierra con Esc y vuelve el foco al botón que lo abrió.

const TONES = {
  danger: {
    icon: 'bg-danger-container text-on-danger-container',
    button: 'bg-on-error-container hover:bg-error focus-visible:outline-error',
  },
  warning: {
    icon: 'bg-warning-container text-on-warning-container',
    button: 'bg-primary-container hover:bg-on-primary-fixed-variant focus-visible:outline-secondary',
  },
  default: {
    icon: 'bg-info-container text-on-info-container',
    button: 'bg-primary-container hover:bg-on-primary-fixed-variant focus-visible:outline-secondary',
  },
};

function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', tone = 'default', icon = 'help', onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const t = TONES[tone] ?? TONES.default;

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-title"
      aria-describedby={message ? 'confirm-message' : undefined}
      onCancel={(e) => {
        e.preventDefault(); // Esc: lo cerramos nosotros para resolver la promesa
        onClose(false);
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(false); // clic en el fondo
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg border border-[#cbd5e1] bg-surface-container-lowest p-0 font-sans text-on-surface shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] backdrop:bg-[rgba(15,23,42,0.25)] backdrop:backdrop-blur-[2px] open:animate-[confirm-in_120ms_ease-out]"
    >
      {open && (
        <div className="flex flex-col gap-space-lg p-space-lg">
          <div className="flex gap-space-md">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${t.icon}`}>
              <span className="material-symbols-outlined text-[22px]">{icon}</span>
            </span>
            <div className="flex flex-col gap-space-xs pt-0.5">
              <h2 id="confirm-title" className="font-headline-md text-headline-md text-on-surface">{title}</h2>
              {message && (
                <p id="confirm-message" className="font-body-md text-body-md text-on-surface-variant">{message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-space-sm sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onClose(false)}
              autoFocus
              className="rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-2 font-body-md text-body-md font-medium text-on-surface hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => onClose(true)}
              className={`rounded-md px-4 py-2 font-body-md text-body-md font-medium text-on-primary shadow-[0_1px_2px_0_rgba(0,0,0,0.08)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${t.button}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}

// Reemplazo de window.confirm: const [dialog, confirm] = useConfirm();
// if (!(await confirm({ title, message, confirmLabel, tone, icon }))) return;
// y renderizar {dialog} en el componente.
export function useConfirm() {
  const [state, setState] = useState(null); // { options, resolve }

  const confirm = useCallback(
    (options) => new Promise((resolve) => setState({ options, resolve })),
    []
  );

  const handleClose = useCallback(
    (result) => {
      state?.resolve(result);
      setState(null);
    },
    [state]
  );

  const dialog = <ConfirmDialog open={state !== null} {...(state?.options ?? {})} onClose={handleClose} />;
  return [dialog, confirm];
}

export default ConfirmDialog;
