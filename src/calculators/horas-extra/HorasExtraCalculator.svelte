<script>
  import { calcularHorasExtra } from '../../lib/horasExtra.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let salarioTexto = $state('');
  let salario = $derived(Number(salarioTexto) || 0);
  let resultado = $derived(calcularHorasExtra(salario));
  let mostrarResultados = $derived(salario > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tus horas extra</h2>
  <FormField etiqueta="Salario mensual">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={salarioTexto} />
    </div>
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Tarifas">
    <ResultRow etiqueta="Salario diario" valor={formatoMoneda(resultado.salarioDiario)} />
    <ResultRow
      etiqueta="Tarifa por hora"
      descripcion="x 1.00 (base), jornada de 8 horas."
      valor={formatoMoneda(resultado.tarifaPorHora)}
    />
    <ResultRow
      etiqueta="Hora extra diurna (o festivo)"
      descripcion="x 2.00"
      valor={formatoMoneda(resultado.diurnaExtra)}
    />
    <ResultRow
      etiqueta="Hora extra nocturna"
      descripcion="x 2.25"
      valor={formatoMoneda(resultado.nocturnaExtra)}
    />
    <ResultRow
      etiqueta="Hora extra en día libre - diurna"
      descripcion="x 1.50"
      valor={formatoMoneda(resultado.diaLibreDiurna)}
    />
    <ResultRow
      etiqueta="Hora extra en día libre - nocturna"
      descripcion="x 1.75"
      valor={formatoMoneda(resultado.diaLibreNocturna)}
    />
  </ResultPanel>
{/if}

<div class="tarjeta">
  <h2>Notas</h2>
  <p>
    La jornada ordinaria diurna no puede exceder ocho horas diarias, ni la
    nocturna siete horas (Art. 161 Código de Trabajo).
  </p>
  <p>
    En labores peligrosas o insalubres, la jornada no puede exceder siete
    horas diarias ni treinta y nueve semanales si es diurna; ni seis horas
    diarias ni treinta y seis semanales si es nocturna (Art. 162 Código de
    Trabajo).
  </p>
</div>

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría legal. Cálculos basados en
  el Código de Trabajo de El Salvador.
</p>
