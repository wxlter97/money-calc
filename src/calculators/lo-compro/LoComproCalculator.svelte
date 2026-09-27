<script>
  import {
    calcularDescuentosMensuales,
    calcularSalarioBrutoDesdeNeto,
  } from '../../lib/deducciones.js';
  import { calcularTiempoDeTrabajo, formatoDesglose } from '../../lib/loCompro.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  const formatoNumero = new Intl.NumberFormat('es-SV', { maximumFractionDigits: 2 });

  let precioTexto = $state('');
  let modoIngreso = $state('neto');
  let salarioTexto = $state('');
  let horasPorDia = $state(8);
  let diasPorSemana = $state(5);

  let precio = $derived(Number(precioTexto) || 0);
  let salarioIngresado = $derived(Number(salarioTexto) || 0);

  let salarioNeto = $derived(
    modoIngreso === 'bruto'
      ? calcularDescuentosMensuales(salarioIngresado).salarioNeto
      : salarioIngresado
  );
  let salarioBruto = $derived(
    modoIngreso === 'bruto' ? salarioIngresado : calcularSalarioBrutoDesdeNeto(salarioIngresado)
  );

  let resultado = $derived(
    calcularTiempoDeTrabajo({
      precio,
      salarioNetoMensual: salarioNeto,
      horasPorDia: Number(horasPorDia) || 0,
      diasPorSemana: Number(diasPorSemana) || 0,
    })
  );

  let mostrarResultados = $derived(
    precio > 0 && salarioNeto > 0 && resultado.horasPorMes > 0
  );
</script>

<div class="tarjeta">
  <h2>¿Cuánto trabajo te cuesta?</h2>

  <FormField etiqueta="Precio del artículo">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={precioTexto} />
    </div>
  </FormField>

  <FormField etiqueta="¿Cómo querés ingresar tu salario?">
    <div class="segmentado">
      <button
        type="button"
        class="segmentado__opcion"
        class:segmentado__opcion--activa={modoIngreso === 'neto'}
        onclick={() => (modoIngreso = 'neto')}
      >
        Salario neto (lo que me pagan)
      </button>
      <button
        type="button"
        class="segmentado__opcion"
        class:segmentado__opcion--activa={modoIngreso === 'bruto'}
        onclick={() => (modoIngreso = 'bruto')}
      >
        Salario bruto
      </button>
    </div>
  </FormField>

  <FormField
    etiqueta={modoIngreso === 'neto' ? 'Salario neto mensual' : 'Salario bruto mensual'}
    ayuda={modoIngreso === 'bruto'
      ? 'Le restamos AFP, ISSS y Renta: tus compras las pagás con tu salario neto.'
      : ''}
  >
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={salarioTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Horas de trabajo por día">
    <input type="number" min="1" max="24" step="0.5" bind:value={horasPorDia} />
  </FormField>

  <FormField etiqueta="Días de trabajo por semana">
    <input type="number" min="1" max="7" step="0.5" bind:value={diasPorSemana} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Lo que te cuesta en tiempo">
    <ResultRow
      etiqueta="Tiempo de trabajo"
      descripcion={`Días de ${formatoNumero.format(horasPorDia)} horas y meses de ${formatoNumero.format(resultado.horasPorMes)} horas de trabajo.`}
      valor={formatoDesglose(resultado.desglose)}
      destacado
    />
    <ResultRow
      etiqueta="En horas"
      valor={`${formatoNumero.format(resultado.horasTotales)} h`}
    />
    <ResultRow
      etiqueta="En días de trabajo"
      valor={`${formatoNumero.format(resultado.diasTotales)} días`}
    />
    <ResultRow
      etiqueta="En meses de trabajo"
      valor={`${formatoNumero.format(resultado.mesesTotales)} meses`}
    />
    <ResultRow
      etiqueta="Porcentaje de tu salario neto mensual"
      valor={`${formatoNumero.format(resultado.porcentajeDelSalario)}%`}
    />
  </ResultPanel>

  <ResultPanel titulo="Tu salario">
    <ResultRow
      etiqueta="Salario bruto mensual"
      descripcion={modoIngreso === 'neto'
        ? 'Estimado a partir del salario neto que ingresaste.'
        : ''}
      valor={formatoMoneda(salarioBruto)}
    />
    <ResultRow
      etiqueta="Salario neto mensual"
      descripcion={modoIngreso === 'bruto'
        ? 'Después de AFP, ISSS y Renta.'
        : ''}
      valor={formatoMoneda(salarioNeto)}
    />
    <ResultRow
      etiqueta="Ganás por hora (neto)"
      valor={formatoMoneda(resultado.tarifaPorHora)}
    />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. El tiempo se
  calcula sobre tu salario neto y tus horas efectivamente trabajadas; no
  incluye aguinaldo, bonos ni otros ingresos.
</p>
