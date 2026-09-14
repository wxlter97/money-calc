// Meta de fondo de emergencia (N meses de gasto) y tiempo para completarla
// según el ahorro actual y el aporte mensual.

export function calcularFondoEmergencia({
  gastoMensual,
  mesesCobertura,
  ahorroActual = 0,
  aporteMensual = 0,
}) {
  const gasto = Math.max(gastoMensual, 0);
  const meses = Math.max(mesesCobertura, 0);
  const ahorro = Math.max(ahorroActual, 0);
  const aporte = Math.max(aporteMensual, 0);

  const metaTotal = gasto * meses;
  const faltante = Math.max(metaTotal - ahorro, 0);
  const porcentajeCompletado = metaTotal > 0 ? Math.min((ahorro / metaTotal) * 100, 100) : 0;
  const mesesParaCompletar = aporte > 0 ? Math.ceil(faltante / aporte) : null;

  return { metaTotal, faltante, porcentajeCompletado, mesesParaCompletar };
}
