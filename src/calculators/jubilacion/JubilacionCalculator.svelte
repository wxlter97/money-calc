<script>
  import { calcularJubilacion } from '../../lib/jubilacion.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let edadActual = $state(30);
  let edadJubilacion = $state(65);
  let ahorroActualTexto = $state('');
  let aporteMensualTexto = $state('');
  let tasaAnualTexto = $state('7');

  let ahorroActual = $derived(Number(ahorroActualTexto) || 0);
  let aporteMensual = $derived(Number(aporteMensualTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);

  let resultado = $derived(
    calcularJubilacion({ edadActual, edadJubilacion, ahorroActual, aporteMensual, tasaAnual })
  );
  let mostrarResultados = $derived(edadJubilacion > edadActual && (ahorroActual > 0 || aporteMensual > 0));
</script>

<div class="tarjeta">
  <h2>Calculá tu jubilación</h2>

  <FormField etiqueta="Edad actual">
    <input type="number" min="0" step="1" bind:value={edadActual} />
  </FormField>

  <FormField etiqueta="Edad de jubilación">
    <input type="number" min="0" step="1" bind:value={edadJubilacion} />
  </FormField>

  <FormField etiqueta="Ahorro actual para el retiro">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={ahorroActualTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Aporte mensual">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={aporteMensualTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Rendimiento anual esperado (%)">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo={`Proyección a los ${edadJubilacion} años`}>
    <ResultRow
      etiqueta="Años para jubilarte"
      valor={`${resultado.aniosParaJubilar} año(s)`}
    />
    <ResultRow etiqueta="Total aportado" valor={formatoMoneda(resultado.totalAportado)} />
    <ResultRow etiqueta="Interés ganado" valor={formatoMoneda(resultado.interesGanado)} />
    <ResultRow
      etiqueta="Ahorro proyectado"
      valor={formatoMoneda(resultado.valorProyectado)}
      destacado
    />
    <ResultRow
      etiqueta="Ingreso mensual estimado"
      descripcion="Regla del 4% de retiro anual sostenible."
      valor={formatoMoneda(resultado.ingresoMensualEstimado)}
    />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera ni de
  pensiones. No sustituye tu ahorro de AFP; es una proyección aparte
  basada en un rendimiento constante.
</p>
