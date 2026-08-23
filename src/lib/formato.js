const formateadorMoneda = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatoMoneda(valor) {
  const numero = Number.isFinite(valor) ? valor : 0;
  return formateadorMoneda.format(numero);
}
