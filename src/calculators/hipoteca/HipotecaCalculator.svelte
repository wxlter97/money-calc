<script>
  import { calcularHipoteca } from '../../lib/hipoteca.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let precioTexto = $state('');
  let porcentajePrima = $state(10);
  let tasaAnualTexto = $state('7');
  let plazoAnios = $state(20);

  let precioPropiedad = $derived(Number(precioTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);

  let resultado = $derived(
    calcularHipoteca({ precioPropiedad, porcentajePrima, tasaAnual, plazoAnios })
  );
  let mostrarResultados = $derived(precioPropiedad > 0 && plazoAnios > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu hipoteca</h2>

  <FormField etiqueta="Precio de la propiedad">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={precioTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Prima / enganche (%)">
    <input type="number" min="0" max="100" step="1" bind:value={porcentajePrima} />
  </FormField>

  <FormField etiqueta="Tasa de interés anual (%)">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>

  <FormField etiqueta="Plazo (años)">
    <input type="number" min="1" step="1" bind:value={plazoAnios} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Financiamiento">
    <ResultRow
      etiqueta="Prima / enganche"
      descripcion={`${porcentajePrima}% del precio de la propiedad.`}
      valor={formatoMoneda(resultado.prima)}
    />
    <ResultRow etiqueta="Monto financiado" valor={formatoMoneda(resultado.montoFinanciado)} />
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
  impuestos sobre la propiedad, seguros, ni comisiones de cierre o de
  originación del préstamo.
</p>
