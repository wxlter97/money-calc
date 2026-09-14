<script>
  import { calcularInteresCompuesto } from '../../lib/interesCompuesto.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let capitalInicialTexto = $state('');
  let aporteMensualTexto = $state('');
  let tasaAnualTexto = $state('8');
  let anios = $state(10);

  let capitalInicial = $derived(Number(capitalInicialTexto) || 0);
  let aporteMensual = $derived(Number(aporteMensualTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);

  let resultado = $derived(
    calcularInteresCompuesto({ capitalInicial, aporteMensual, tasaAnual, anios })
  );
  let mostrarResultados = $derived(capitalInicial > 0 || aporteMensual > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu interés compuesto</h2>

  <FormField etiqueta="Capital inicial">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={capitalInicialTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Aporte mensual" ayuda="Opcional">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={aporteMensualTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Tasa de interés anual (%)">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>

  <FormField etiqueta="Plazo (años)">
    <input type="number" min="0" step="1" bind:value={anios} />
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo="Proyección">
    <ResultRow etiqueta="Total aportado" valor={formatoMoneda(resultado.totalAportado)} />
    <ResultRow
      etiqueta="Interés ganado"
      descripcion="Diferencia entre el valor final y lo aportado."
      valor={formatoMoneda(resultado.interesGanado)}
    />
    <ResultRow
      etiqueta="Valor final"
      descripcion={`Después de ${anios} año(s) al ${tasaAnual}% anual, capitalizado mensualmente.`}
      valor={formatoMoneda(resultado.valorFinal)}
      destacado
    />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. Asume
  capitalización mensual y aportes al final de cada mes; no incluye
  impuestos ni comisiones.
</p>
