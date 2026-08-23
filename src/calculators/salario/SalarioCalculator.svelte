<script>
  import {
    calcularDescuentosMensuales,
    mensualAQuincenal,
  } from '../../lib/deducciones.js';
  import {
    ANTIGUEDADES,
    calcularAguinaldo,
    calcularQuincena25,
    calcularBonoVacacional,
    diasTrabajadosDesdeMeses,
    diasTrabajadosDesdeFecha,
  } from '../../lib/prestaciones.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  let salarioTexto = $state('');
  let antiguedad = $state('1a3');
  let modoAntiguedad = $state('meses');
  let mesesTrabajados = $state(0);
  let fechaContratacion = $state('');
  let porcentajeBono = $state(30);

  let salario = $derived(Number(salarioTexto) || 0);

  let diasTrabajados = $derived.by(() => {
    if (antiguedad !== 'menos1') return 0;
    if (modoAntiguedad === 'fecha') return diasTrabajadosDesdeFecha(fechaContratacion);
    return diasTrabajadosDesdeMeses(mesesTrabajados);
  });

  let descuentosMensuales = $derived(calcularDescuentosMensuales(salario));

  let descuentosQuincenales = $derived.by(() => {
    const m = descuentosMensuales;
    const salarioQuincenal = salario / 2;
    const afp = mensualAQuincenal(m.afp);
    const afpPatronal = mensualAQuincenal(m.afpPatronal);
    const isss = mensualAQuincenal(m.isss);
    const isssPatronal = mensualAQuincenal(m.isssPatronal);
    const renta = mensualAQuincenal(m.renta);
    const totalDescuentos = afp + isss + renta;
    return {
      afp,
      afpPatronal,
      isss,
      isssPatronal,
      renta,
      totalDescuentos,
      salarioNeto: salarioQuincenal - totalDescuentos,
    };
  });

  let quincena25 = $derived(
    calcularQuincena25({ salarioMensual: salario, antiguedad, diasTrabajados })
  );
  let bonoVacacional = $derived(calcularBonoVacacional(salario, porcentajeBono));
  let aguinaldo = $derived(
    calcularAguinaldo({ salarioMensual: salario, antiguedad, diasTrabajados })
  );

  let mostrarResultados = $derived(salario > 0);
</script>

<div class="tarjeta">
  <h2>Calculá tu salario</h2>

  <FormField etiqueta="Salario mensual">
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={salarioTexto} />
    </div>
  </FormField>

  <FormField etiqueta="Antigüedad en la empresa">
    <select bind:value={antiguedad}>
      {#each ANTIGUEDADES as opcion}
        <option value={opcion.valor}>{opcion.etiqueta}</option>
      {/each}
    </select>
  </FormField>

  {#if antiguedad === 'menos1'}
    <FormField etiqueta="¿Cómo querés indicar el tiempo trabajado?">
      <div class="segmentado">
        <button
          type="button"
          class="segmentado__opcion"
          class:segmentado__opcion--activa={modoAntiguedad === 'meses'}
          onclick={() => (modoAntiguedad = 'meses')}
        >
          Meses trabajados
        </button>
        <button
          type="button"
          class="segmentado__opcion"
          class:segmentado__opcion--activa={modoAntiguedad === 'fecha'}
          onclick={() => (modoAntiguedad = 'fecha')}
        >
          Fecha de contratación
        </button>
      </div>
    </FormField>

    {#if modoAntiguedad === 'meses'}
      <FormField etiqueta="Meses trabajados" ayuda="0 a 11 meses, se permiten decimales">
        <input type="number" min="0" max="11" step="0.1" bind:value={mesesTrabajados} />
      </FormField>
    {:else}
      <FormField
        etiqueta="Fecha de contratación"
        ayuda="Se calculan los días trabajados hasta hoy"
      >
        <input type="date" bind:value={fechaContratacion} />
      </FormField>
    {/if}
  {/if}

  <FormField etiqueta="Bono vacacional (%)" ayuda="30% por defecto según el Código de Trabajo">
    <input type="number" min="0" step="1" bind:value={porcentajeBono} />
  </FormField>
</div>

<div class="tarjeta">
  <h2>Prestaciones y pagos adicionales</h2>

  <div class="fila-resultado">
    <div class="fila-resultado__texto">
      <span class="fila-resultado__etiqueta">Quincena 25</span>
      <span class="fila-resultado__descripcion">
        50% del salario mensual, solo si el salario es de hasta $1,500 y hay al
        menos 1 año de antigüedad. Prorrateada si es menor a 1 año. Exenta de
        descuentos.
      </span>
    </div>
    <span class="fila-resultado__valor">{formatoMoneda(quincena25)}</span>
  </div>

  <div class="fila-resultado">
    <div class="fila-resultado__texto">
      <span class="fila-resultado__etiqueta">Bono vacacional</span>
      <span class="fila-resultado__descripcion">
        {porcentajeBono}% del salario quincenal. Exento de descuentos.
      </span>
    </div>
    <span class="fila-resultado__valor">{formatoMoneda(bonoVacacional)}</span>
  </div>

  <div class="fila-resultado">
    <div class="fila-resultado__texto">
      <span class="fila-resultado__etiqueta">Aguinaldo</span>
      <span class="fila-resultado__descripcion">
        Art. 198 Código de Trabajo: 15 días (1-3 años), 19 días (3-9 años) o 21
        días (10+ años) de salario. Fecha máxima de pago: 20 de diciembre.
      </span>
    </div>
    <span class="fila-resultado__valor">{formatoMoneda(aguinaldo)}</span>
  </div>

  <p class="nota-legal">
    Menos de 1 año de antigüedad: la Quincena 25 y el aguinaldo se prorratean
    así — 15 × (días trabajados / 365) × salario diario.
  </p>
</div>

{#if mostrarResultados}
  <div class="rejilla--dos-columnas">
    <ResultPanel titulo="Mensual">
      <ResultRow
        etiqueta="AFP"
        descripcion="7.25% del salario."
        valor={formatoMoneda(descuentosMensuales.afp)}
      />
      <ResultRow
        etiqueta="AFP patronal"
        descripcion="8.75% a cargo del empleador (Art. 16 Ley SAP). No se descuenta de tu pago."
        valor={formatoMoneda(descuentosMensuales.afpPatronal)}
      />
      <ResultRow
        etiqueta="ISSS"
        descripcion="3% del salario, con tope de $30 mensuales."
        valor={formatoMoneda(descuentosMensuales.isss)}
      />
      <ResultRow
        etiqueta="ISSS patronal"
        descripcion="7.5% a cargo del empleador. No se descuenta de tu pago."
        valor={formatoMoneda(descuentosMensuales.isssPatronal)}
      />
      <ResultRow etiqueta="Renta" valor={formatoMoneda(descuentosMensuales.renta)} />
      <ResultRow
        etiqueta="Total de descuentos"
        valor={formatoMoneda(descuentosMensuales.totalDescuentos)}
      />
      <ResultRow
        etiqueta="Salario neto mensual"
        descripcion="Lo que recibís al final del mes, después de descuentos."
        valor={formatoMoneda(descuentosMensuales.salarioNeto)}
        destacado
      />
    </ResultPanel>

    <ResultPanel titulo="Quincenal">
      <ResultRow
        etiqueta="AFP"
        descripcion="7.25% del salario."
        valor={formatoMoneda(descuentosQuincenales.afp)}
      />
      <ResultRow
        etiqueta="AFP patronal"
        descripcion="8.75% a cargo del empleador. No se descuenta de tu pago."
        valor={formatoMoneda(descuentosQuincenales.afpPatronal)}
      />
      <ResultRow
        etiqueta="ISSS"
        descripcion="3% del salario, con tope de $15 quincenales."
        valor={formatoMoneda(descuentosQuincenales.isss)}
      />
      <ResultRow
        etiqueta="ISSS patronal"
        descripcion="7.5% a cargo del empleador. No se descuenta de tu pago."
        valor={formatoMoneda(descuentosQuincenales.isssPatronal)}
      />
      <ResultRow etiqueta="Renta" valor={formatoMoneda(descuentosQuincenales.renta)} />
      <ResultRow
        etiqueta="Total de descuentos"
        valor={formatoMoneda(descuentosQuincenales.totalDescuentos)}
      />
      <ResultRow
        etiqueta="Salario neto quincenal"
        descripcion="Lo que recibís al final de la quincena, después de descuentos."
        valor={formatoMoneda(descuentosQuincenales.salarioNeto)}
        destacado
      />
    </ResultPanel>
  </div>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría legal ni fiscal. Cálculos
  basados en el Código de Trabajo, la Ley del Sistema de Ahorro para
  Pensiones y la tabla de retención de Renta vigente desde el Decreto
  Legislativo No. 10 (30 de abril de 2025, Diario Oficial Tomo 447).
</p>
