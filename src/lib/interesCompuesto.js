// Proyección de interés compuesto con aportes mensuales opcionales.

import { valorFuturoAhorro } from './financiero.js';

export function calcularInteresCompuesto({
  capitalInicial,
  aporteMensual = 0,
  tasaAnual,
  anios,
}) {
  const meses = Math.max(anios, 0) * 12;
  const valorFinal = valorFuturoAhorro({
    capitalInicial,
    aporteMensual,
    tasaAnualPorcentaje: tasaAnual,
    meses,
  });
  const totalAportado = Math.max(capitalInicial, 0) + Math.max(aporteMensual, 0) * meses;
  const interesGanado = valorFinal - totalAportado;

  return { valorFinal, totalAportado, interesGanado };
}
