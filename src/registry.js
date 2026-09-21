// Single source of truth for every calculator in the app. The nav, the hub
// grid, and the router all read from this list — add a calculator here
// (plus its own lib/*.js and calculators/*.svelte) and nothing else needs
// to change.

import SalarioCalculator from './calculators/salario/SalarioCalculator.svelte';
import HorasExtraCalculator from './calculators/horas-extra/HorasExtraCalculator.svelte';
import InteresCompuestoCalculator from './calculators/interes-compuesto/InteresCompuestoCalculator.svelte';
import PrestamoCalculator from './calculators/prestamo/PrestamoCalculator.svelte';
import HipotecaCalculator from './calculators/hipoteca/HipotecaCalculator.svelte';
import PagoTarjetaCalculator from './calculators/pago-tarjeta/PagoTarjetaCalculator.svelte';
import RoiCalculator from './calculators/roi/RoiCalculator.svelte';
import InflacionCalculator from './calculators/inflacion/InflacionCalculator.svelte';
import JubilacionCalculator from './calculators/jubilacion/JubilacionCalculator.svelte';
import AhorroMensualCalculator from './calculators/ahorro-mensual/AhorroMensualCalculator.svelte';
import FondoEmergenciaCalculator from './calculators/fondo-emergencia/FondoEmergenciaCalculator.svelte';
import PrecioMaximoCompraCalculator from './calculators/precio-maximo-compra/PrecioMaximoCompraCalculator.svelte';

export const calculadoras = [
  {
    slug: 'salario',
    titulo: 'Salario y descuentos de ley',
    resumen:
      'Salario neto mensual y quincenal: AFP, ISSS, Renta, aguinaldo, bono vacacional y Quincena 25. Ingresá tu salario bruto o neto, y simulá un aumento.',
    componente: SalarioCalculator,
  },
  {
    slug: 'horas-extra',
    titulo: 'Horas extra',
    resumen:
      'Tarifa por hora y pago de horas extra diurnas, nocturnas y en día libre.',
    componente: HorasExtraCalculator,
  },
  {
    slug: 'interes-compuesto',
    titulo: 'Interés compuesto',
    resumen:
      'Proyectá cuánto crece tu dinero con capital inicial, aportes mensuales y una tasa anual.',
    componente: InteresCompuestoCalculator,
  },
  {
    slug: 'prestamo',
    titulo: 'Préstamo',
    resumen: 'Cuota mensual, total de intereses y total a pagar de un préstamo.',
    componente: PrestamoCalculator,
  },
  {
    slug: 'hipoteca',
    titulo: 'Hipoteca',
    resumen:
      'Prima, monto financiado y cuota mensual de una hipoteca según el precio de la propiedad.',
    componente: HipotecaCalculator,
  },
  {
    slug: 'pago-tarjeta',
    titulo: 'Pago de tarjeta de crédito',
    resumen:
      'Cuánto tiempo y cuánto interés te toma liquidar un saldo con un pago mensual fijo.',
    componente: PagoTarjetaCalculator,
  },
  {
    slug: 'roi',
    titulo: 'ROI',
    resumen: 'Ganancia neta, retorno porcentual y retorno anualizado de una inversión.',
    componente: RoiCalculator,
  },
  {
    slug: 'inflacion',
    titulo: 'Inflación',
    resumen:
      'Cuánto necesitarás en el futuro y cuánto pierde de valor tu dinero por la inflación.',
    componente: InflacionCalculator,
  },
  {
    slug: 'jubilacion',
    titulo: 'Jubilación',
    resumen:
      'Proyección de tu ahorro para el retiro e ingreso mensual estimado con la regla del 4%.',
    componente: JubilacionCalculator,
  },
  {
    slug: 'ahorro-mensual',
    titulo: 'Ahorro mensual',
    resumen: 'Cuánto necesitás ahorrar cada mes para alcanzar una meta en un plazo dado.',
    componente: AhorroMensualCalculator,
  },
  {
    slug: 'fondo-emergencia',
    titulo: 'Fondo de emergencia',
    resumen:
      'Meta de ahorro según tus gastos esenciales y el tiempo para completarla.',
    componente: FondoEmergenciaCalculator,
  },
  {
    slug: 'precio-maximo-compra',
    titulo: 'Precio máximo de compra',
    resumen:
      'Cuánto podés financiar según la cuota mensual que podés pagar, la tasa y el plazo.',
    componente: PrecioMaximoCompraCalculator,
  },
];
