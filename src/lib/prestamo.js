// Cuota mensual fija de un préstamo (sistema de amortización francés).

import { pagoMensualPrestamo } from './financiero.js';

export function calcularPrestamo({ monto, tasaAnual, plazoMeses }) {
  const cuotaMensual = pagoMensualPrestamo(monto, tasaAnual, plazoMeses);
  const n = Math.max(Math.round(plazoMeses), 0);
  const totalPagado = cuotaMensual * n;
  const totalIntereses = totalPagado - Math.max(monto, 0);

  return { cuotaMensual, totalPagado, totalIntereses };
}
