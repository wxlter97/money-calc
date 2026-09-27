// Tarifa de trabajo independiente (freelance): cuánto cobrar por hora, día,
// semana, mes y proyecto para alcanzar un ingreso objetivo.
//
// El cálculo va de "lo que querés tener en la bolsa" hacia atrás:
//   1. Ingreso neto anual objetivo (deseado, o equivalente a un salario de
//      empleado con aguinaldo, bono vacacional y Quincena 25).
//   2. + gastos del negocio + aportes a AFP/ISSS como independiente.
//   3. + margen (ahorro para meses flojos, imprevistos, crecimiento).
//   4. Se sube para compensar la retención de Renta del 10% que hace el
//      cliente por servicios profesionales.
//   5. Se divide entre las horas facturables del año (descontando
//      vacaciones, feriados, enfermedad y tiempo no facturable).
// El IVA (13%) se suma al final, sobre la tarifa, y no es ingreso tuyo.

import {
  AFP_TASA_LABORAL,
  AFP_TASA_PATRONAL,
  ISSS_TASA_LABORAL,
  ISSS_TASA_PATRONAL,
  ISSS_TOPE_LABORAL,
  calcularDescuentosMensuales,
} from './deducciones.js';
import {
  calcularAguinaldo,
  calcularBonoVacacional,
  calcularQuincena25,
} from './prestaciones.js';

export const RETENCION_RENTA_SERVICIOS = 0.1;
export const TASA_IVA = 0.13;

/** Como independiente pagás la parte laboral y la patronal. */
export const AFP_TASA_INDEPENDIENTE = AFP_TASA_LABORAL + AFP_TASA_PATRONAL;
export const ISSS_TASA_INDEPENDIENTE = ISSS_TASA_LABORAL + ISSS_TASA_PATRONAL;
/** Salario máximo sobre el que se cotiza ISSS (tope laboral / tasa laboral). */
export const ISSS_SALARIO_MAXIMO_COTIZABLE = ISSS_TOPE_LABORAL / ISSS_TASA_LABORAL;

export const SEMANAS_POR_ANIO = 52;

/**
 * Ingreso neto anual que recibe un empleado con ese salario bruto mensual:
 * 12 salarios netos + aguinaldo + bono vacacional + Quincena 25.
 */
export function ingresoNetoAnualDeEmpleado(salarioBrutoMensual, antiguedad = '1a3') {
  const salario = Math.max(salarioBrutoMensual, 0);
  const netoMensual = calcularDescuentosMensuales(salario).salarioNeto;
  const aguinaldo = calcularAguinaldo({ salarioMensual: salario, antiguedad, diasTrabajados: 365 });
  const bonoVacacional = calcularBonoVacacional(salario);
  const quincena25 = calcularQuincena25({ salarioMensual: salario, antiguedad, diasTrabajados: 365 });

  return {
    salariosNetos: netoMensual * 12,
    aguinaldo,
    bonoVacacional,
    quincena25,
    total: netoMensual * 12 + aguinaldo + bonoVacacional + quincena25,
  };
}

/** Aportes anuales a AFP e ISSS como independiente sobre un ingreso mensual declarado. */
export function aportesIndependienteAnuales(ingresoMensualCotizable) {
  const base = Math.max(ingresoMensualCotizable, 0);
  const afp = base * AFP_TASA_INDEPENDIENTE * 12;
  const isss = Math.min(base, ISSS_SALARIO_MAXIMO_COTIZABLE) * ISSS_TASA_INDEPENDIENTE * 12;
  return { afp, isss, total: afp + isss };
}

/** Horas y días de trabajo del año, descontando tiempo libre y no facturable. */
export function calcularHorasDelAnio({
  horasPorDia,
  diasPorSemana,
  diasVacaciones,
  diasFeriados,
  diasEnfermedad,
  porcentajeFacturable,
}) {
  const diasLaborablesBrutos = Math.max(diasPorSemana, 0) * SEMANAS_POR_ANIO;
  const diasLibres =
    Math.max(diasVacaciones, 0) + Math.max(diasFeriados, 0) + Math.max(diasEnfermedad, 0);
  const diasTrabajados = Math.max(diasLaborablesBrutos - diasLibres, 0);
  const horasTrabajadas = diasTrabajados * Math.max(horasPorDia, 0);
  const horasFacturables = horasTrabajadas * (Math.min(Math.max(porcentajeFacturable, 0), 100) / 100);

  return { diasLaborablesBrutos, diasLibres, diasTrabajados, horasTrabajadas, horasFacturables };
}

export function calcularTarifaFreelance({
  ingresoNetoAnual,
  ingresoMensualCotizable,
  gastosMensuales = 0,
  margen = 0,
  incluirRetencion = true,
  incluirAportes = true,
  horasPorDia = 8,
  diasPorSemana = 5,
  diasVacaciones = 15,
  diasFeriados = 11,
  diasEnfermedad = 5,
  porcentajeFacturable = 70,
}) {
  const netoAnual = Math.max(ingresoNetoAnual, 0);
  const gastosAnuales = Math.max(gastosMensuales, 0) * 12;
  const aportes = incluirAportes
    ? aportesIndependienteAnuales(ingresoMensualCotizable)
    : { afp: 0, isss: 0, total: 0 };

  const costoAnual = netoAnual + gastosAnuales + aportes.total;
  const montoMargen = costoAnual * (Math.max(margen, 0) / 100);
  const subtotal = costoAnual + montoMargen;

  const tasaRetencion = incluirRetencion ? RETENCION_RENTA_SERVICIOS : 0;
  const facturacionAnual = subtotal / (1 - tasaRetencion);
  const retencionAnual = facturacionAnual - subtotal;

  const horas = calcularHorasDelAnio({
    horasPorDia,
    diasPorSemana,
    diasVacaciones,
    diasFeriados,
    diasEnfermedad,
    porcentajeFacturable,
  });

  const tarifaPorHora = horas.horasFacturables > 0 ? facturacionAnual / horas.horasFacturables : 0;
  const tarifaPorDia = tarifaPorHora * Math.max(horasPorDia, 0);
  const tarifaPorSemana = tarifaPorDia * Math.max(diasPorSemana, 0);
  const tarifaPorMes = facturacionAnual / 12;

  return {
    netoAnual,
    gastosAnuales,
    aportes,
    montoMargen,
    retencionAnual,
    facturacionAnual,
    horas,
    tasaRetencion,
    tarifaPorHora,
    tarifaPorDia,
    tarifaPorSemana,
    tarifaPorMes,
  };
}

/** Precio de un proyecto: horas estimadas + colchón de contingencia + gastos directos. */
export function calcularPrecioProyecto({
  tarifaPorHora,
  horasEstimadas,
  porcentajeContingencia = 0,
  gastosDirectos = 0,
  tasaRetencion = 0,
  incluirIva = false,
}) {
  const horasBase = Math.max(horasEstimadas, 0);
  const horasContingencia = horasBase * (Math.max(porcentajeContingencia, 0) / 100);
  const horasTotales = horasBase + horasContingencia;

  const honorarios = horasTotales * Math.max(tarifaPorHora, 0);
  const gastos = Math.max(gastosDirectos, 0);
  const precioSinIva = honorarios + gastos;
  const iva = incluirIva ? precioSinIva * TASA_IVA : 0;
  const precioConIva = precioSinIva + iva;
  // La retención de Renta se aplica sobre el monto sin IVA.
  const retencion = precioSinIva * tasaRetencion;
  const montoRecibido = precioConIva - retencion;

  return {
    horasContingencia,
    horasTotales,
    honorarios,
    gastos,
    precioSinIva,
    iva,
    precioConIva,
    retencion,
    montoRecibido,
  };
}
