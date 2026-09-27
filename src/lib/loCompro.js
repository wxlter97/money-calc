// "¿Lo compro?": cuánto tiempo de trabajo te cuesta un artículo, a partir
// de tu salario neto mensual (lo que realmente recibís) y tu jornada.

export const SEMANAS_POR_MES = 52 / 12;

/**
 * Tiempo de trabajo equivalente al precio de un artículo.
 *
 * El desglose usa unidades de trabajo, no de calendario: un "día" es una
 * jornada (horasPorDia) y un "mes" son las horas trabajadas en un mes
 * (horasPorDia × diasPorSemana × 52/12).
 */
export function calcularTiempoDeTrabajo({
  precio,
  salarioNetoMensual,
  horasPorDia = 8,
  diasPorSemana = 5,
}) {
  const costo = Math.max(precio, 0);
  const neto = Math.max(salarioNetoMensual, 0);
  const horasDia = Math.max(horasPorDia, 0);
  const horasPorMes = horasDia * Math.max(diasPorSemana, 0) * SEMANAS_POR_MES;

  const valido = neto > 0 && horasPorMes > 0;
  const tarifaPorHora = valido ? neto / horasPorMes : 0;
  const horasTotales = valido ? costo / tarifaPorHora : 0;

  // Se redondea a minutos enteros antes de desglosar, para no mostrar
  // "60 minutos" por error de punto flotante.
  let minutosRestantes = Math.round(horasTotales * 60);
  const minutosPorMes = Math.round(horasPorMes * 60);
  const minutosPorDia = Math.round(horasDia * 60);

  const meses = minutosPorMes > 0 ? Math.floor(minutosRestantes / minutosPorMes) : 0;
  minutosRestantes -= meses * minutosPorMes;
  const dias = minutosPorDia > 0 ? Math.floor(minutosRestantes / minutosPorDia) : 0;
  minutosRestantes -= dias * minutosPorDia;
  const horas = Math.floor(minutosRestantes / 60);
  const minutos = minutosRestantes - horas * 60;

  return {
    tarifaPorHora,
    horasPorMes,
    horasTotales,
    diasTotales: horasDia > 0 ? horasTotales / horasDia : 0,
    mesesTotales: horasPorMes > 0 ? horasTotales / horasPorMes : 0,
    porcentajeDelSalario: neto > 0 ? (costo / neto) * 100 : 0,
    desglose: { meses, dias, horas, minutos },
  };
}

/** "2 días, 9 horas, 5 minutos" — omite las unidades en cero. */
export function formatoDesglose({ meses, dias, horas, minutos }) {
  const partes = [
    [meses, 'mes', 'meses'],
    [dias, 'día', 'días'],
    [horas, 'hora', 'horas'],
    [minutos, 'minuto', 'minutos'],
  ]
    .filter(([valor]) => valor > 0)
    .map(([valor, singular, plural]) => `${valor} ${valor === 1 ? singular : plural}`);

  return partes.length > 0 ? partes.join(', ') : 'Menos de 1 minuto';
}
