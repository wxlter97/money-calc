// Precio máximo de compra financiable a partir de la cuota mensual que
// podés pagar, la tasa de interés y el plazo (más una prima/enganche
// opcional en efectivo).

import { montoPrestamoDesdeCuota } from './financiero.js';

export function calcularPrecioMaximo({ pagoMensualMaximo, tasaAnual, plazoAnios, prima = 0 }) {
  const plazoMeses = Math.max(plazoAnios, 0) * 12;
  const montoFinanciable = montoPrestamoDesdeCuota(pagoMensualMaximo, tasaAnual, plazoMeses);
  const primaDisponible = Math.max(prima, 0);
  const precioMaximoCompra = montoFinanciable + primaDisponible;

  return { plazoMeses, montoFinanciable, precioMaximoCompra };
}
