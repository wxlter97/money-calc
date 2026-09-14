// Fórmulas financieras genéricas (interés compuesto, anualidades) que
// comparten las calculadoras de interés compuesto, préstamo, hipoteca,
// jubilación, ahorro mensual, fondo de emergencia y precio máximo de compra.
// Convención: las tasas anuales se reciben como porcentaje (p. ej. 12 = 12%)
// y se convierten internamente a tasa mensual efectiva simple (tasaAnual/12).

/** Tasa de interés mensual (decimal) a partir de una tasa anual en porcentaje. */
export function tasaMensual(tasaAnualPorcentaje) {
  return Math.max(tasaAnualPorcentaje, 0) / 100 / 12;
}

/**
 * Cuota mensual fija de un préstamo (sistema francés / amortización
 * estándar) dado el monto, la tasa anual (%) y el plazo en meses.
 */
export function pagoMensualPrestamo(monto, tasaAnualPorcentaje, plazoMeses) {
  const m = Math.max(monto, 0);
  const n = Math.max(Math.round(plazoMeses), 0);
  if (n === 0) return 0;
  const r = tasaMensual(tasaAnualPorcentaje);
  if (r === 0) return m / n;
  return (m * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Monto máximo de préstamo que se puede financiar con una cuota mensual
 * dada (inversa de pagoMensualPrestamo).
 */
export function montoPrestamoDesdeCuota(pagoMensual, tasaAnualPorcentaje, plazoMeses) {
  const pago = Math.max(pagoMensual, 0);
  const n = Math.max(Math.round(plazoMeses), 0);
  if (n === 0) return 0;
  const r = tasaMensual(tasaAnualPorcentaje);
  if (r === 0) return pago * n;
  return (pago * (1 - Math.pow(1 + r, -n))) / r;
}

/**
 * Valor futuro de un ahorro con capital inicial y aportes mensuales fijos,
 * capitalizados a una tasa anual (%) durante cierta cantidad de meses.
 */
export function valorFuturoAhorro({ capitalInicial = 0, aporteMensual = 0, tasaAnualPorcentaje, meses }) {
  const capital = Math.max(capitalInicial, 0);
  const aporte = Math.max(aporteMensual, 0);
  const n = Math.max(Math.round(meses), 0);
  const r = tasaMensual(tasaAnualPorcentaje);

  if (r === 0) return capital + aporte * n;
  return capital * Math.pow(1 + r, n) + aporte * ((Math.pow(1 + r, n) - 1) / r);
}

/**
 * Aporte mensual necesario para alcanzar una meta de ahorro, dado un capital
 * inicial, una tasa anual (%) y un plazo en meses (inversa de valorFuturoAhorro).
 */
export function aporteMensualParaMeta({ metaMonto, capitalInicial = 0, tasaAnualPorcentaje, meses }) {
  const meta = Math.max(metaMonto, 0);
  const capital = Math.max(capitalInicial, 0);
  const n = Math.max(Math.round(meses), 0);
  const r = tasaMensual(tasaAnualPorcentaje);

  if (n === 0) return 0;
  if (r === 0) return Math.max(meta - capital, 0) / n;

  const valorFuturoCapital = capital * Math.pow(1 + r, n);
  const factor = (Math.pow(1 + r, n) - 1) / r;
  return Math.max((meta - valorFuturoCapital) / factor, 0);
}
