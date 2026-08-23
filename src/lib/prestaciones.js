// Prestaciones y pagos adicionales: aguinaldo, Quincena 25 y bono
// vacacional. Fuente: Código de Trabajo (Art. 198, 200) y el Comunicado del
// Ministerio de Trabajo sobre la Bonificación (Quincena 25).

export const DIAS_POR_MES = 30;
export const DIAS_POR_ANIO = 365;

export const ANTIGUEDADES = [
  { valor: 'menos1', etiqueta: 'Menos de 1 año' },
  { valor: '1a3', etiqueta: '1 a 3 años' },
  { valor: '3a9', etiqueta: '3 a 9 años' },
  { valor: '10mas', etiqueta: '10 años o más' },
];

/** Días de aguinaldo según el tramo de antigüedad (Art. 198 Código de Trabajo). */
export function diasAguinaldoPorAntiguedad(antiguedad) {
  switch (antiguedad) {
    case '1a3':
      return 15;
    case '3a9':
      return 19;
    case '10mas':
      return 21;
    default:
      // Menos de 1 año: el tramo base (1 a 3 años) se prorratea por separado.
      return 15;
  }
}

/** Días trabajados equivalentes a partir de meses trabajados (mes de 30 días). */
export function diasTrabajadosDesdeMeses(mesesTrabajados) {
  const meses = Number(mesesTrabajados) || 0;
  return clamp(Math.max(meses, 0) * DIAS_POR_MES, 0, DIAS_POR_ANIO);
}

/**
 * Días trabajados desde una fecha de contratación hasta hoy (o hasta
 * `fechaReferencia` si se indica), acotados a un máximo de un año. Este es
 * el número de días "trabajados a la fecha", no el período fiscal exacto de
 * aguinaldo (13 dic.–12 dic.) del Código de Trabajo.
 */
export function diasTrabajadosDesdeFecha(fechaContratacionISO, fechaReferencia = new Date()) {
  if (!fechaContratacionISO) return 0;
  const inicio = new Date(fechaContratacionISO);
  if (Number.isNaN(inicio.getTime())) return 0;

  const msPorDia = 1000 * 60 * 60 * 24;
  const dias = (fechaReferencia.getTime() - inicio.getTime()) / msPorDia;
  return clamp(dias, 0, DIAS_POR_ANIO);
}

function clamp(valor, min, max) {
  return Math.min(Math.max(valor, min), max);
}

/**
 * Aguinaldo mensual. Con menos de 1 año de antigüedad se prorratea:
 * (días base del primer tramo × días trabajados / 365) × salario diario.
 */
export function calcularAguinaldo({ salarioMensual, antiguedad, diasTrabajados = 0 }) {
  const salarioDiario = Math.max(salarioMensual, 0) / DIAS_POR_MES;
  const dias = diasAguinaldoPorAntiguedad(antiguedad);

  if (antiguedad === 'menos1') {
    const diasProporcionales = dias * (diasTrabajados / DIAS_POR_ANIO);
    return diasProporcionales * salarioDiario;
  }

  return dias * salarioDiario;
}

/**
 * Quincena 25: 50% del salario mensual para quienes ganan hasta $1,500 y
 * tienen al menos 1 año de antigüedad. Se prorratea igual que el aguinaldo
 * si la antigüedad es menor a 1 año. Exenta de AFP, ISSS y Renta.
 */
export function calcularQuincena25({ salarioMensual, antiguedad, diasTrabajados = 0 }) {
  if (salarioMensual > 1500) return 0;

  const montoCompleto = salarioMensual * 0.5;

  if (antiguedad === 'menos1') {
    return montoCompleto * (diasTrabajados / DIAS_POR_ANIO);
  }

  return montoCompleto;
}

/**
 * Bono vacacional: porcentaje (30% por defecto) del salario quincenal.
 * Exento de descuentos de ley.
 */
export function calcularBonoVacacional(salarioMensual, porcentaje = 30) {
  const salarioQuincenal = Math.max(salarioMensual, 0) / 2;
  return salarioQuincenal * (porcentaje / 100);
}
