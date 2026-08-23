// Single source of truth for every calculator in the app. The nav, the hub
// grid, and the router all read from this list — add a calculator here
// (plus its own lib/*.js and calculators/*.svelte) and nothing else needs
// to change.

import SalarioCalculator from './calculators/salario/SalarioCalculator.svelte';
import HorasExtraCalculator from './calculators/horas-extra/HorasExtraCalculator.svelte';

export const calculadoras = [
  {
    slug: 'salario',
    titulo: 'Salario y descuentos de ley',
    resumen:
      'Salario neto mensual y quincenal: AFP, ISSS, Renta, aguinaldo, bono vacacional y Quincena 25.',
    componente: SalarioCalculator,
  },
  {
    slug: 'horas-extra',
    titulo: 'Horas extra',
    resumen:
      'Tarifa por hora y pago de horas extra diurnas, nocturnas y en día libre.',
    componente: HorasExtraCalculator,
  },
];
