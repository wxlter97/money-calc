<script>
  import { calcularAhorroMensual } from '../../lib/ahorroMensual.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let metaTexto = $state('');
  let plazoMeses = $state(12);
  let tasaAnualTexto = $state('0');
  let ahorroInicialTexto = $state('');

  let metaMonto = $derived(Number(metaTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);
  let ahorroInicial = $derived(Number(ahorroInicialTexto) || 0);

  let resultado = $derived(
    calcularAhorroMensual({ metaMonto, plazoMeses, tasaAnual, ahorroInicial })
  );
  let mostrarResultados = $derived(metaMonto > 0 && plazoMeses > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu ahorro mensual</h2>

  <FormField etiqueta="Meta de ahorro">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={metaTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Plazo (meses)">
    <input type="number" min="1" step="1" bind:value={plazoMeses} />
  </FormField>

  <FormField etiqueta="Ahorro inicial" ayuda="Opcional">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={ahorroInicialTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Rendimiento anual esperado (%)" ayuda="Dejá en 0 si vas a ahorrar sin invertir">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Plan de ahorro">
    <ResultRow
      etiqueta="Aporte mensual necesario"
      valor={formatoMoneda(resultado.aporteMensualNecesario)}
      destacado
    />
    <ResultRow etiqueta="Total aportado" valor={formatoMoneda(resultado.totalAportado)} />
    <ResultRow etiqueta="Interés ganado" valor={formatoMoneda(resultado.interesGanado)} />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. Asume
  aportes iguales cada mes y, si indicás un rendimiento, capitalización
  mensual.
</p>
