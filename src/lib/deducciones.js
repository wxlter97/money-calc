// Descuentos de ley sobre salario mensual: AFP, ISSS y Renta.
// Fuente: Ley del Sistema de Ahorro para Pensiones (Art. 16, tasa patronal/
// laboral de AFP), Ley del Seguro Social (tasas y tope de ISSS), y Decreto
// Legislativo No. 10 (30 de abril de 2025, Diario Oficial Tomo 447) para la
// tabla de retención de Impuesto Sobre la Renta.

export const AFP_TASA_LABORAL = 0.0725;
export const AFP_TASA_PATRONAL = 0.0875;

export const ISSS_TASA_LABORAL = 0.03;
export const ISSS_TOPE_LABORAL = 30;
export const ISSS_TASA_PATRONAL = 0.075;
export const ISSS_TOPE_PATRONAL = 75;

/** Tabla de retención mensual de Renta (Decreto 10/2025). */
export const TRAMOS_RENTA = [
  { limiteInferior: 0, limiteSuperior: 550.0, cuotaFija: 0, tasa: 0, sobreExcesoDe: 0 },
  { limiteInferior: 550.01, limiteSuperior: 895.24, cuotaFija: 17.67, tasa: 0.1, sobreExcesoDe: 550.0 },
  { limiteInferior: 895.25, limiteSuperior: 2038.1, cuotaFija: 60.0, tasa: 0.2, sobreExcesoDe: 895.24 },
  { limiteInferior: 2038.11, limiteSuperior: Infinity, cuotaFija: 288.57, tasa: 0.3, sobreExcesoDe: 2038.1 },
];

export function calcularAFP(salarioMensual) {
  return Math.max(salarioMensual, 0) * AFP_TASA_LABORAL;
}

export function calcularAFPPatronal(salarioMensual) {
  return Math.max(salarioMensual, 0) * AFP_TASA_PATRONAL;
}

export function calcularISSS(salarioMensual) {
  return Math.min(Math.max(salarioMensual, 0) * ISSS_TASA_LABORAL, ISSS_TOPE_LABORAL);
}

export function calcularISSSPatronal(salarioMensual) {
  return Math.min(Math.max(salarioMensual, 0) * ISSS_TASA_PATRONAL, ISSS_TOPE_PATRONAL);
}

/**
 * Impuesto sobre la Renta mensual, calculado sobre la base imponible
 * (salario menos AFP e ISSS laboral) según la tabla de retención vigente.
 */
export function calcularRenta(salarioMensual) {
  const salario = Math.max(salarioMensual, 0);
  const baseImponible = salario - calcularAFP(salario) - calcularISSS(salario);

  const tramo =
    TRAMOS_RENTA.find(
      (t) => baseImponible >= t.limiteInferior && baseImponible <= t.limiteSuperior
    ) ?? TRAMOS_RENTA[0];

  const renta = tramo.cuotaFija + tramo.tasa * (baseImponible - tramo.sobreExcesoDe);
  return Math.max(renta, 0);
}

/** Convierte un monto mensual a su equivalente quincenal (mitad del mes). */
export function mensualAQuincenal(montoMensual) {
  return montoMensual / 2;
}

/** Calcula el juego completo de descuentos mensuales para un salario dado. */
export function calcularDescuentosMensuales(salarioMensual) {
  const afp = calcularAFP(salarioMensual);
  const afpPatronal = calcularAFPPatronal(salarioMensual);
  const isss = calcularISSS(salarioMensual);
  const isssPatronal = calcularISSSPatronal(salarioMensual);
  const renta = calcularRenta(salarioMensual);
  const totalDescuentos = afp + isss + renta;
  const salarioNeto = salarioMensual - totalDescuentos;

  return { afp, afpPatronal, isss, isssPatronal, renta, totalDescuentos, salarioNeto };
}
