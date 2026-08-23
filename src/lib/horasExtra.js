// Cálculo de horas extra a partir del salario mensual.
// Fuente: Código de Trabajo, Art. 161 (jornadas) y Art. 168/169 (recargos).

export const MULTIPLICADORES = {
  diurnaExtra: 2.0,
  nocturnaExtra: 2.25,
  diaLibreDiurna: 1.5,
  diaLibreNocturna: 1.75,
};

/**
 * Salario diario (mes de 30 días), tarifa por hora (jornada de 8 horas) y
 * el valor de cada tipo de hora extra.
 */
export function calcularHorasExtra(salarioMensual) {
  const salario = Math.max(salarioMensual, 0);
  const salarioDiario = salario / 30;
  const tarifaPorHora = salarioDiario / 8;

  return {
    salarioDiario,
    tarifaPorHora,
    diurnaExtra: tarifaPorHora * MULTIPLICADORES.diurnaExtra,
    nocturnaExtra: tarifaPorHora * MULTIPLICADORES.nocturnaExtra,
    diaLibreDiurna: tarifaPorHora * MULTIPLICADORES.diaLibreDiurna,
    diaLibreNocturna: tarifaPorHora * MULTIPLICADORES.diaLibreNocturna,
  };
}
