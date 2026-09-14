// Cuota de hipoteca: prima (enganche) + monto financiado a amortizar.

import { pagoMensualPrestamo } from './financiero.js';

export function calcularHipoteca({ precioPropiedad, porcentajePrima, tasaAnual, plazoAnios }) {
  const precio = Math.max(precioPropiedad, 0);
  const prima = precio * (Math.max(porcentajePrima, 0) / 100);
  const montoFinanciado = precio - prima;
  const plazoMeses = Math.max(plazoAnios, 0) * 12;

  const cuotaMensual = pagoMensualPrestamo(montoFinanciado, tasaAnual, plazoMeses);
  const totalPagado = cuotaMensual * plazoMeses;
  const totalIntereses = totalPagado - montoFinanciado;

  return { prima, montoFinanciado, plazoMeses, cuotaMensual, totalPagado, totalIntereses };
}
