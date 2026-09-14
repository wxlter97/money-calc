// Proyección de ahorro para el retiro y estimación de ingreso mensual con
// la regla del 4% de retiro anual sostenible.

import { valorFuturoAhorro } from './financiero.js';

export const TASA_RETIRO_ANUAL = 0.04;

export function calcularJubilacion({
  edadActual,
  edadJubilacion,
  ahorroActual = 0,
  aporteMensual = 0,
  tasaAnual,
}) {
  const aniosParaJubilar = Math.max(edadJubilacion - edadActual, 0);
  const meses = aniosParaJubilar * 12;

  const valorProyectado = valorFuturoAhorro({
    capitalInicial: ahorroActual,
    aporteMensual,
    tasaAnualPorcentaje: tasaAnual,
    meses,
  });
  const totalAportado = Math.max(ahorroActual, 0) + Math.max(aporteMensual, 0) * meses;
  const interesGanado = valorProyectado - totalAportado;
  const ingresoMensualEstimado = (valorProyectado * TASA_RETIRO_ANUAL) / 12;

  return { aniosParaJubilar, valorProyectado, totalAportado, interesGanado, ingresoMensualEstimado };
}
