// Tiempo e intereses para liquidar un saldo de tarjeta de crédito con un
// pago mensual fijo, simulando mes a mes el interés sobre saldo.

const LIMITE_MESES = 1200; // 100 años: tope de seguridad para evitar bucles infinitos.

export function calcularPagoTarjeta({ saldo, tasaAnual, pagoMensual }) {
  const r = Math.max(tasaAnual, 0) / 100 / 12;
  const pago = Math.max(pagoMensual, 0);
  let balance = Math.max(saldo, 0);

  if (balance === 0) {
    return { meses: 0, totalIntereses: 0, totalPagado: 0, pagoInsuficiente: false };
  }

  const interesPrimerMes = balance * r;
  if (pago <= interesPrimerMes) {
    return {
      meses: null,
      totalIntereses: null,
      totalPagado: null,
      pagoInsuficiente: true,
      interesPrimerMes,
    };
  }

  let meses = 0;
  let totalIntereses = 0;

  while (balance > 0.005 && meses < LIMITE_MESES) {
    const interes = balance * r;
    totalIntereses += interes;
    balance = balance + interes - pago;
    meses++;
  }

  const totalPagado = Math.max(saldo, 0) + totalIntereses;

  return { meses, totalIntereses, totalPagado, pagoInsuficiente: false };
}
