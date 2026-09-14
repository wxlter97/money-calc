<script>
  import { calcularFondoEmergencia } from '../../lib/fondoEmergencia.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let gastoMensualTexto = $state('');
  let mesesCobertura = $state(6);
  let ahorroActualTexto = $state('');
  let aporteMensualTexto = $state('');

  let gastoMensual = $derived(Number(gastoMensualTexto) || 0);
  let ahorroActual = $derived(Number(ahorroActualTexto) || 0);
  let aporteMensual = $derived(Number(aporteMensualTexto) || 0);

  let resultado = $derived(
    calcularFondoEmergencia({ gastoMensual, mesesCobertura, ahorroActual, aporteMensual })
  );
  let mostrarResultados = $derived(gastoMensual > 0 && mesesCobertura > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu fondo de emergencia</h2>

  <FormField etiqueta="Gasto mensual esencial">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={gastoMensualTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Meses de cobertura deseados" ayuda="3 a 6 meses es lo recomendado usualmente">
    <input type="number" min="1" step="1" bind:value={mesesCobertura} />
  </FormField>

  <FormField etiqueta="Ahorro actual" ayuda="Opcional">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={ahorroActualTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Aporte mensual" ayuda="Opcional, para estimar cuánto falta en el tiempo">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={aporteMensualTexto} />
    </div>
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Meta">
    <ResultRow
      etiqueta="Meta total"
      descripcion={`${mesesCobertura} mes(es) de gasto esencial.`}
      valor={formatoMoneda(resultado.metaTotal)}
      destacado
    />
    <ResultRow
      etiqueta="Progreso actual"
      valor={`${resultado.porcentajeCompletado.toFixed(1)}%`}
    />
    <ResultRow etiqueta="Falta por ahorrar" valor={formatoMoneda(resultado.faltante)} />
    {#if resultado.mesesParaCompletar !== null}
      <ResultRow
        etiqueta="Tiempo para completarlo"
        valor={`${resultado.mesesParaCompletar} mes(es)`}
      />
    {/if}
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. El número
  de meses de cobertura ideal depende de tu situación (dependientes,
  estabilidad de ingresos, etc.).
</p>
