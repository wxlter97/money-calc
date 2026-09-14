// Impacto de la inflación sobre el poder adquisitivo y el costo futuro de
// un monto de referencia.

export function calcularInflacion({ montoActual, tasaInflacionAnual, anios }) {
  const monto = Math.max(montoActual, 0);
  const tasa = Math.max(tasaInflacionAnual, 0) / 100;
  const n = Math.max(anios, 0);
  const factor = Math.pow(1 + tasa, n);

  const montoFuturoNecesario = monto * factor;
  const poderAdquisitivoFuturo = monto / factor;
  const perdidaPoderAdquisitivo = monto - poderAdquisitivoFuturo;

  return { montoFuturoNecesario, poderAdquisitivoFuturo, perdidaPoderAdquisitivo };
}
