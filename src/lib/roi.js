// Retorno sobre la inversión (ROI): ganancia neta, porcentaje y, si se
// indican años, el retorno anualizado equivalente (CAGR).

export function calcularROI({ inversionInicial, valorFinal, anios = 0 }) {
  const inversion = Math.max(inversionInicial, 0);
  const final = Math.max(valorFinal, 0);
  const gananciaNeta = final - inversion;
  const roiPorcentaje = inversion > 0 ? (gananciaNeta / inversion) * 100 : 0;

  let roiAnualizado = null;
  if (anios > 0 && inversion > 0) {
    roiAnualizado = (Math.pow(final / inversion, 1 / anios) - 1) * 100;
  }

  return { gananciaNeta, roiPorcentaje, roiAnualizado };
}
