<script>
  import { calcularInflacion } from '../../lib/inflacion.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let montoTexto = $state('');
  let tasaInflacionTexto = $state('4');
  let anios = $state(10);

  let montoActual = $derived(Number(montoTexto) || 0);
  let tasaInflacionAnual = $derived(Number(tasaInflacionTexto) || 0);

  let resultado = $derived(
    calcularInflacion({ montoActual, tasaInflacionAnual, anios })
  );
  let mostrarResultados = $derived(montoActual > 0);
</script>

<div class="tarjeta">
  <h2>Calculá el efecto de la inflación</h2>

  <FormField etiqueta="Monto actual">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={montoTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Tasa de inflación anual (%)">
    <input type="number" min="0" step="0.1" bind:value={tasaInflacionTexto} />
  </FormField>

  <FormField etiqueta="Plazo (años)">
    <input type="number" min="0" step="1" bind:value={anios} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Impacto de la inflación">
    <ResultRow
      etiqueta="Necesitarás en el futuro"
      descripcion={`Para comprar en ${anios} año(s) lo que hoy cuesta ${formatoMoneda(montoActual)}.`}
      valor={formatoMoneda(resultado.montoFuturoNecesario)}
      destacado
    />
    <ResultRow
      etiqueta="Poder adquisitivo futuro"
      descripcion={`Lo que hoy vale ${formatoMoneda(montoActual)}, en ${anios} año(s).`}
      valor={formatoMoneda(resultado.poderAdquisitivoFuturo)}
    />
    <ResultRow
      etiqueta="Pérdida de poder adquisitivo"
      valor={formatoMoneda(resultado.perdidaPoderAdquisitivo)}
    />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. Asume una
  tasa de inflación anual constante durante todo el plazo.
</p>
