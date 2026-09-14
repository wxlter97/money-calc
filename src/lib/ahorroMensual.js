// Aporte mensual necesario para alcanzar una meta de ahorro en un plazo dado.

import { aporteMensualParaMeta } from './financiero.js';

export function calcularAhorroMensual({
  metaMonto,
  plazoMeses,
  tasaAnual = 0,
  ahorroInicial = 0,
}) {
  const aporteMensualNecesario = aporteMensualParaMeta({
    metaMonto,
    capitalInicial: ahorroInicial,
    tasaAnualPorcentaje: tasaAnual,
    meses: plazoMeses,
  });

  const n = Math.max(Math.round(plazoMeses), 0);
  const totalAportado = Math.max(ahorroInicial, 0) + aporteMensualNecesario * n;
  const interesGanado = Math.max(metaMonto, 0) - totalAportado;

  return { aporteMensualNecesario, totalAportado, interesGanado };
}
