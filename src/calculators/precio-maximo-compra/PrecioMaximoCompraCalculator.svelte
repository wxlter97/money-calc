<script>
  import { calcularPrecioMaximo } from '../../lib/precioMaximo.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let pagoMensualMaximoTexto = $state('');
  let tasaAnualTexto = $state('10');
  let plazoAnios = $state(5);
  let primaTexto = $state('');

  let pagoMensualMaximo = $derived(Number(pagoMensualMaximoTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);
  let prima = $derived(Number(primaTexto) || 0);

  let resultado = $derived(
    calcularPrecioMaximo({ pagoMensualMaximo, tasaAnual, plazoAnios, prima })
  );
  let mostrarResultados = $derived(pagoMensualMaximo > 0 && plazoAnios > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu precio máximo de compra</h2>

  <FormField etiqueta="Cuota mensual máxima que podés pagar">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        bind:value={pagoMensualMaximoTexto}
      />
    </div>
  </FormField>

  <FormField etiqueta="Tasa de interés anual (%)">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>

  <FormField etiqueta="Plazo (años)">
    <input type="number" min="1" step="1" bind:value={plazoAnios} />
  </FormField>

  <FormField etiqueta="Prima / enganche en efectivo" ayuda="Opcional">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={primaTexto} />
    </div>
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Capacidad de compra">
    <ResultRow etiqueta="Monto financiable" valor={formatoMoneda(resultado.montoFinanciable)} />
    <ResultRow
      etiqueta="Precio máximo de compra"
      descripcion="Monto financiable + prima en efectivo."
      valor={formatoMoneda(resultado.precioMaximoCompra)}
      destacado
    />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. No incluye
  impuestos, seguros ni comisiones que puedan sumarse al precio final.
</p>
