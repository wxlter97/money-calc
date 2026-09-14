<script>
  import { calcularPrestamo } from '../../lib/prestamo.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let montoTexto = $state('');
  let tasaAnualTexto = $state('12');
  let plazoMeses = $state(24);

  let monto = $derived(Number(montoTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);

  let resultado = $derived(calcularPrestamo({ monto, tasaAnual, plazoMeses }));
  let mostrarResultados = $derived(monto > 0 && plazoMeses > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu préstamo</h2>

  <FormField etiqueta="Monto del préstamo">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={montoTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Tasa de interés anual (%)">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>

  <FormField etiqueta="Plazo (meses)">
    <input type="number" min="1" step="1" bind:value={plazoMeses} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Cuota">
    <ResultRow
      etiqueta="Cuota mensual"
      descripcion="Sistema de amortización francés (cuota fija)."
      valor={formatoMoneda(resultado.cuotaMensual)}
      destacado
    />
    <ResultRow etiqueta="Total de intereses" valor={formatoMoneda(resultado.totalIntereses)} />
    <ResultRow etiqueta="Total a pagar" valor={formatoMoneda(resultado.totalPagado)} />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. No incluye
  seguros, comisiones bancarias ni otros cargos que pueda aplicar el
  prestamista.
</p>
