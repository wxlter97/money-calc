<script>
  import {
    calcularDescuentosMensuales,
    calcularDescuentosQuincenales,
    calcularSalarioBrutoDesdeNeto,
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

  let modoIngreso = $state('bruto');
  let salarioTexto = $state('');
  let antiguedad = $state('1a3');
  let modoAntiguedad = $state('meses');
  let mesesTrabajados = $state(0);
  let fechaContratacion = $state('');
  let porcentajeBono = $state(30);
  let porcentajeAumentoTexto = $state('');

  let salarioIngresado = $derived(Number(salarioTexto) || 0);

  let salario = $derived(
    modoIngreso === 'neto'
      ? calcularSalarioBrutoDesdeNeto(salarioIngresado)
      : salarioIngresado
  );

  let diasTrabajados = $derived.by(() => {
    if (antiguedad !== 'menos1') return 0;
    if (modoAntiguedad === 'fecha') return diasTrabajadosDesdeFecha(fechaContratacion);
    return diasTrabajadosDesdeMeses(mesesTrabajados);
  });

  let descuentosMensuales = $derived(calcularDescuentosMensuales(salario));
  let descuentosQuincenales = $derived(calcularDescuentosQuincenales(salario));

  let quincena25 = $derived(
    calcularQuincena25({ salarioMensual: salario, antiguedad, diasTrabajados })
  );
  let bonoVacacional = $derived(calcularBonoVacacional(salario, porcentajeBono));
  let aguinaldo = $derived(
    calcularAguinaldo({ salarioMensual: salario, antiguedad, diasTrabajados })
  );

  let mostrarResultados = $derived(salario > 0);

  let porcentajeAumento = $derived(Number(porcentajeAumentoTexto) || 0);
  let salarioConAumento = $derived(salario * (1 + porcentajeAumento / 100));
  let descuentosMensualesAumento = $derived(calcularDescuentosMensuales(salarioConAumento));
  let descuentosQuincenalesAumento = $derived(calcularDescuentosQuincenales(salarioConAumento));
  let aumentoBrutoMensual = $derived(salarioConAumento - salario);
  let aumentoNetoMensual = $derived(
    descuentosMensualesAumento.salarioNeto - descuentosMensuales.salarioNeto
  );
  let mostrarAumento = $derived(mostrarResultados && porcentajeAumentoTexto !== '');
</script>

<div class="tarjeta">
  <h2>Calculá tu salario</h2>

  <FormField etiqueta="¿Cómo querés ingresar tu salario?">
    <div class="segmentado">
      <button
        type="button"
        class="segmentado__opcion"
        class:segmentado__opcion--activa={modoIngreso === 'bruto'}
        onclick={() => (modoIngreso = 'bruto')}
      >
        Salario bruto
      </button>
      <button
        type="button"
        class="segmentado__opcion"
        class:segmentado__opcion--activa={modoIngreso === 'neto'}
        onclick={() => (modoIngreso = 'neto')}
      >
        Salario neto (lo que me pagan)
      </button>
    </div>
  </FormField>

  <FormField
    etiqueta={modoIngreso === 'neto' ? 'Salario neto mensual' : 'Salario bruto mensual'}
    ayuda={modoIngreso === 'neto'
      ? 'Lo que recibís en tu cuenta después de descuentos. Calculamos el salario bruto que le corresponde.'
      : ''}
  >
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

<div class="tarjeta">
  <h2>Calculá un aumento</h2>

  <FormField
    etiqueta="Porcentaje de aumento (%)"
    ayuda="Se aplica sobre tu salario bruto actual, calculado o ingresado arriba."
  >
    <input type="number" min="0" step="0.1" placeholder="0" bind:value={porcentajeAumentoTexto} />
  </FormField>
</div>

{#if mostrarResultados}
  <div class="rejilla--dos-columnas">
    <ResultPanel titulo="Mensual">
      <ResultRow
        etiqueta="Salario bruto mensual"
        descripcion={modoIngreso === 'neto'
          ? 'Estimado a partir del salario neto que ingresaste.'
          : ''}
        valor={formatoMoneda(salario)}
      />
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
        etiqueta="Salario bruto quincenal"
        descripcion={modoIngreso === 'neto'
          ? 'Estimado a partir del salario neto que ingresaste.'
          : ''}
        valor={formatoMoneda(salario / 2)}
      />
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

{#if mostrarAumento}
  <div class="rejilla--dos-columnas">
    <ResultPanel titulo="Mensual con aumento">
      <ResultRow
        etiqueta="Salario bruto mensual"
        descripcion={`Aumento de ${formatoMoneda(aumentoBrutoMensual)} sobre tu salario bruto actual.`}
        valor={formatoMoneda(salarioConAumento)}
      />
      <ResultRow
        etiqueta="Total de descuentos"
        valor={formatoMoneda(descuentosMensualesAumento.totalDescuentos)}
      />
      <ResultRow
        etiqueta="Salario neto mensual"
        descripcion={`Aumento de ${formatoMoneda(aumentoNetoMensual)} sobre tu salario neto actual.`}
        valor={formatoMoneda(descuentosMensualesAumento.salarioNeto)}
        destacado
      />
    </ResultPanel>

    <ResultPanel titulo="Quincenal con aumento">
      <ResultRow
        etiqueta="Salario bruto quincenal"
        descripcion={`Aumento de ${formatoMoneda(aumentoBrutoMensual / 2)} sobre tu salario bruto actual.`}
        valor={formatoMoneda(salarioConAumento / 2)}
      />
      <ResultRow
        etiqueta="Total de descuentos"
        valor={formatoMoneda(descuentosQuincenalesAumento.totalDescuentos)}
      />
      <ResultRow
        etiqueta="Salario neto quincenal"
        descripcion={`Aumento de ${formatoMoneda(aumentoNetoMensual / 2)} sobre tu salario neto actual.`}
        valor={formatoMoneda(descuentosQuincenalesAumento.salarioNeto)}
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
