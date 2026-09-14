<script>
  import { calcularROI } from '../../lib/roi.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let inversionTexto = $state('');
  let valorFinalTexto = $state('');
  let anios = $state(0);

  let inversionInicial = $derived(Number(inversionTexto) || 0);
  let valorFinal = $derived(Number(valorFinalTexto) || 0);

  let resultado = $derived(calcularROI({ inversionInicial, valorFinal, anios }));
  let mostrarResultados = $derived(inversionInicial > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu ROI</h2>

  <FormField etiqueta="Inversión inicial">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={inversionTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Valor final">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={valorFinalTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Tiempo transcurrido (años)" ayuda="Opcional, para calcular el retorno anualizado">
    <input type="number" min="0" step="0.1" bind:value={anios} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Retorno">
    <ResultRow etiqueta="Ganancia neta" valor={formatoMoneda(resultado.gananciaNeta)} />
    <ResultRow
      etiqueta="ROI"
      descripcion="Ganancia neta sobre la inversión inicial."
      valor={`${resultado.roiPorcentaje.toFixed(2)}%`}
      destacado
    />
    {#if resultado.roiAnualizado !== null}
      <ResultRow
        etiqueta="ROI anualizado"
        descripcion="Tasa de crecimiento anual compuesta (CAGR)."
        valor={`${resultado.roiAnualizado.toFixed(2)}%`}
      />
    {/if}
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría de inversión. No
  considera impuestos, comisiones ni aportes o retiros intermedios.
</p>
