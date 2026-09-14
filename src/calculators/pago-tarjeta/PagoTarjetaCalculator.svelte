<script>
  import { calcularPagoTarjeta } from '../../lib/tarjeta.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let saldoTexto = $state('');
  let tasaAnualTexto = $state('36');
  let pagoMensualTexto = $state('');

  let saldo = $derived(Number(saldoTexto) || 0);
  let tasaAnual = $derived(Number(tasaAnualTexto) || 0);
  let pagoMensual = $derived(Number(pagoMensualTexto) || 0);

  let resultado = $derived(calcularPagoTarjeta({ saldo, tasaAnual, pagoMensual }));
  let mostrarResultados = $derived(saldo > 0 && pagoMensual > 0);

  let anios = $derived.by(() => {
    if (!resultado.meses) return 0;
    return Math.floor(resultado.meses / 12);
  });
  let mesesRestantes = $derived.by(() => {
    if (!resultado.meses) return 0;
    return resultado.meses % 12;
  });
</script>

<div class="tarjeta">
  <h2>Calculá el pago de tu tarjeta</h2>

  <FormField etiqueta="Saldo actual">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={saldoTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Tasa de interés anual (%)" ayuda="La tasa anual (CAT/APR) de tu tarjeta">
    <input type="number" min="0" step="0.1" bind:value={tasaAnualTexto} />
  </FormField>

  <FormField etiqueta="Pago mensual">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={pagoMensualTexto} />
    </div>
  </FormField>
</div>

{#if mostrarResultados && resultado.pagoInsuficiente}
  <div class="tarjeta">
    <h2>Pago insuficiente</h2>
    <p>
      Con un pago de {formatoMoneda(pagoMensual)} nunca terminás de pagar el
      saldo: el interés del primer mes ya es
      {formatoMoneda(resultado.interesPrimerMes)}. Subí el pago mensual por
      encima de ese monto.
    </p>
  </div>
{:else if mostrarResultados}
  <ResultPanel titulo="Plan de pago">
    <ResultRow
      etiqueta="Tiempo para liquidar"
      descripcion={`${resultado.meses} mes(es) en total.`}
      valor={anios > 0 ? `${anios} año(s) ${mesesRestantes} mes(es)` : `${mesesRestantes} mes(es)`}
      destacado
    />
    <ResultRow etiqueta="Total de intereses" valor={formatoMoneda(resultado.totalIntereses)} />
    <ResultRow etiqueta="Total a pagar" valor={formatoMoneda(resultado.totalPagado)} />
  </ResultPanel>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría financiera. Asume una
  tasa fija y que no se agregan nuevos cargos al saldo.
</p>
