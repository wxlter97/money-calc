<script>
  import {
    calcularTarifaFreelance,
    calcularPrecioProyecto,
    ingresoNetoAnualDeEmpleado,
    AFP_TASA_INDEPENDIENTE,
    ISSS_TASA_INDEPENDIENTE,
    ISSS_SALARIO_MAXIMO_COTIZABLE,
    TASA_IVA,
  } from '../../lib/tarifaFreelance.js';
  import { ANTIGUEDADES } from '../../lib/prestaciones.js';
  import { formatoMoneda } from '../../lib/formato.js';
  import ResultPanel from '../../components/ResultPanel.svelte';
  import ResultRow from '../../components/ResultRow.svelte';
  import FormField from '../../components/FormField.svelte';

  const formatoNumero = new Intl.NumberFormat('es-SV', { maximumFractionDigits: 1 });
  const porcentaje = (tasa) => `${formatoNumero.format(tasa * 100)}%`;

  // Punto de partida
  let modoBase = $state('ingreso');
  let ingresoDeseadoTexto = $state('');
  let salarioReferenciaTexto = $state('');
  let antiguedad = $state('1a3');

  // Costos
  let gastosMensualesTexto = $state('');
  let margen = $state(10);
  let incluirRetencion = $state(true);
  let incluirAportes = $state(true);
  let incluirIva = $state(false);

  // Tiempo
  let horasPorDia = $state(8);
  let diasPorSemana = $state(5);
  let diasVacaciones = $state(15);
  let diasFeriados = $state(11);
  let diasEnfermedad = $state(5);
  let porcentajeFacturable = $state(70);

  // Proyecto
  let horasProyectoTexto = $state('');
  let contingencia = $state(20);
  let gastosProyectoTexto = $state('');

  let ingresoDeseado = $derived(Number(ingresoDeseadoTexto) || 0);
  let salarioReferencia = $derived(Number(salarioReferenciaTexto) || 0);

  let empleado = $derived(ingresoNetoAnualDeEmpleado(salarioReferencia, antiguedad));

  let ingresoNetoAnual = $derived(modoBase === 'salario' ? empleado.total : ingresoDeseado * 12);
  let ingresoMensualCotizable = $derived(
    modoBase === 'salario' ? salarioReferencia : ingresoDeseado
  );

  let resultado = $derived(
    calcularTarifaFreelance({
      ingresoNetoAnual,
      ingresoMensualCotizable,
      gastosMensuales: Number(gastosMensualesTexto) || 0,
      margen: Number(margen) || 0,
      incluirRetencion,
      incluirAportes,
      horasPorDia: Number(horasPorDia) || 0,
      diasPorSemana: Number(diasPorSemana) || 0,
      diasVacaciones: Number(diasVacaciones) || 0,
      diasFeriados: Number(diasFeriados) || 0,
      diasEnfermedad: Number(diasEnfermedad) || 0,
      porcentajeFacturable: Number(porcentajeFacturable) || 0,
    })
  );

  let horasProyecto = $derived(Number(horasProyectoTexto) || 0);
  let proyecto = $derived(
    calcularPrecioProyecto({
      tarifaPorHora: resultado.tarifaPorHora,
      horasEstimadas: horasProyecto,
      porcentajeContingencia: Number(contingencia) || 0,
      gastosDirectos: Number(gastosProyectoTexto) || 0,
      tasaRetencion: resultado.tasaRetencion,
      incluirIva,
    })
  );

  let mostrarResultados = $derived(ingresoNetoAnual > 0 && resultado.tarifaPorHora > 0);
  let mostrarProyecto = $derived(mostrarResultados && horasProyecto > 0);

  const conIva = (monto) => (incluirIva ? monto * (1 + TASA_IVA) : monto);
  const descripcionIva = (monto) =>
    incluirIva ? `${formatoMoneda(conIva(monto))} con IVA.` : '';
</script>

{#snippet siNo(activo, cambiar)}
  <div class="segmentado">
    <button
      type="button"
      class="segmentado__opcion"
      class:segmentado__opcion--activa={activo}
      onclick={() => cambiar(true)}
    >
      Sí
    </button>
    <button
      type="button"
      class="segmentado__opcion"
      class:segmentado__opcion--activa={!activo}
      onclick={() => cambiar(false)}
    >
      No
    </button>
  </div>
{/snippet}

<div class="tarjeta">
  <h2>¿Cuánto querés ganar?</h2>

  <FormField etiqueta="Punto de partida">
    <div class="segmentado">
      <button
        type="button"
        class="segmentado__opcion"
        class:segmentado__opcion--activa={modoBase === 'ingreso'}
        onclick={() => (modoBase = 'ingreso')}
      >
        Ingreso neto deseado
      </button>
      <button
        type="button"
        class="segmentado__opcion"
        class:segmentado__opcion--activa={modoBase === 'salario'}
        onclick={() => (modoBase = 'salario')}
      >
        Igualar un salario de empleado
      </button>
    </div>
  </FormField>

  {#if modoBase === 'ingreso'}
    <FormField
      etiqueta="Ingreso neto mensual deseado"
      ayuda="Lo que querés tener en la bolsa cada mes, después de impuestos, aportes y gastos del negocio."
    >
      <div class="campo-monto">
        <span class="campo-monto__prefijo">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          bind:value={ingresoDeseadoTexto}
        />
      </div>
    </FormField>
  {:else}
    <FormField
      etiqueta="Salario bruto mensual de referencia"
      ayuda="El salario del empleo que querés igualar. Se suman aguinaldo, bono vacacional y Quincena 25."
    >
      <div class="campo-monto">
        <span class="campo-monto__prefijo">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          bind:value={salarioReferenciaTexto}
        />
      </div>
    </FormField>

    <FormField etiqueta="Antigüedad equivalente" ayuda="Define los días de aguinaldo.">
      <select bind:value={antiguedad}>
        {#each ANTIGUEDADES.filter((a) => a.valor !== 'menos1') as opcion}
          <option value={opcion.valor}>{opcion.etiqueta}</option>
        {/each}
      </select>
    </FormField>
  {/if}
</div>

<div class="tarjeta">
  <h2>Costos, impuestos y margen</h2>

  <FormField
    etiqueta="Gastos mensuales del negocio"
    ayuda="Software, internet, equipo, coworking, contador, cursos, etc."
  >
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={gastosMensualesTexto} />
    </div>
  </FormField>

  <FormField
    etiqueta="Margen (%)"
    ayuda="Colchón para meses sin clientes, imprevistos y crecimiento."
  >
    <input type="number" min="0" step="1" bind:value={margen} />
  </FormField>

  <FormField
    etiqueta="¿El cliente te retiene 10% de Renta?"
    ayuda="Retención por servicios profesionales. La tarifa se sube para compensarla."
  >
    {@render siNo(incluirRetencion, (v) => (incluirRetencion = v))}
  </FormField>

  <FormField
    etiqueta="¿Pagás AFP e ISSS como independiente?"
    ayuda={`AFP ${porcentaje(AFP_TASA_INDEPENDIENTE)} e ISSS ${porcentaje(ISSS_TASA_INDEPENDIENTE)} (hasta ${formatoMoneda(ISSS_SALARIO_MAXIMO_COTIZABLE)} cotizables), sobre ${modoBase === 'salario' ? 'el salario de referencia' : 'tu ingreso deseado'}.`}
  >
    {@render siNo(incluirAportes, (v) => (incluirAportes = v))}
  </FormField>

  <FormField
    etiqueta="¿Cobrás IVA (13%)?"
    ayuda="Si estás inscrito como contribuyente. El IVA se suma a la tarifa y no es ingreso tuyo."
  >
    {@render siNo(incluirIva, (v) => (incluirIva = v))}
  </FormField>
</div>

<div class="tarjeta">
  <h2>Tu tiempo</h2>

  <FormField etiqueta="Horas de trabajo por día">
    <input type="number" min="1" max="24" step="0.5" bind:value={horasPorDia} />
  </FormField>

  <FormField etiqueta="Días de trabajo por semana">
    <input type="number" min="1" max="7" step="0.5" bind:value={diasPorSemana} />
  </FormField>

  <FormField
    etiqueta="Días de vacaciones al año"
    ayuda="Un empleado tiene 15 días (Art. 177 Código de Trabajo)."
  >
    <input type="number" min="0" step="1" bind:value={diasVacaciones} />
  </FormField>

  <FormField etiqueta="Días feriados al año" ayuda="Asuetos nacionales que no vas a trabajar.">
    <input type="number" min="0" step="1" bind:value={diasFeriados} />
  </FormField>

  <FormField etiqueta="Días de enfermedad al año">
    <input type="number" min="0" step="1" bind:value={diasEnfermedad} />
  </FormField>

  <FormField
    etiqueta="Horas facturables (%)"
    ayuda="Parte de tu jornada que le cobrás a clientes. El resto se va en ventas, administración y aprendizaje."
  >
    <input type="number" min="1" max="100" step="1" bind:value={porcentajeFacturable} />
  </FormField>
</div>

<div class="tarjeta">
  <h2>Cotizá un proyecto</h2>

  <FormField etiqueta="Horas estimadas del proyecto">
    <input type="number" min="0" step="0.5" placeholder="0" bind:value={horasProyectoTexto} />
  </FormField>

  <FormField
    etiqueta="Contingencia (%)"
    ayuda="Colchón para revisiones, cambios y tareas que se estiman de menos."
  >
    <input type="number" min="0" step="1" bind:value={contingencia} />
  </FormField>

  <FormField
    etiqueta="Gastos directos del proyecto"
    ayuda="Licencias, stock, hosting, viáticos, etc. que se cobran aparte."
  >
    <div class="campo-monto">
      <span class="campo-monto__prefijo">$</span>
      <input type="number" min="0" step="0.01" placeholder="0.00" bind:value={gastosProyectoTexto} />
    </div>
  </FormField>
</div>

{#if mostrarResultados}
  <ResultPanel titulo={incluirIva ? 'Cuánto cobrar (sin IVA)' : 'Cuánto cobrar'}>
    <ResultRow
      etiqueta="Por hora"
      descripcion={descripcionIva(resultado.tarifaPorHora)}
      valor={formatoMoneda(resultado.tarifaPorHora)}
      destacado
    />
    <ResultRow
      etiqueta="Por día"
      descripcion={`Jornada de ${formatoNumero.format(horasPorDia)} horas. ${descripcionIva(resultado.tarifaPorDia)}`}
      valor={formatoMoneda(resultado.tarifaPorDia)}
    />
    <ResultRow
      etiqueta="Por semana"
      descripcion={`${formatoNumero.format(diasPorSemana)} días de trabajo. ${descripcionIva(resultado.tarifaPorSemana)}`}
      valor={formatoMoneda(resultado.tarifaPorSemana)}
    />
    <ResultRow
      etiqueta="Por mes (dedicación completa)"
      descripcion={`Promedio mensual de tu facturación anual. ${descripcionIva(resultado.tarifaPorMes)}`}
      valor={formatoMoneda(resultado.tarifaPorMes)}
    />
  </ResultPanel>

  {#if mostrarProyecto}
    <ResultPanel titulo="Precio del proyecto">
      <ResultRow
        etiqueta="Honorarios"
        descripcion={`${formatoNumero.format(horasProyecto)} h + ${formatoNumero.format(proyecto.horasContingencia)} h de contingencia = ${formatoNumero.format(proyecto.horasTotales)} h.`}
        valor={formatoMoneda(proyecto.honorarios)}
      />
      {#if proyecto.gastos > 0}
        <ResultRow etiqueta="Gastos directos" valor={formatoMoneda(proyecto.gastos)} />
      {/if}
      {#if incluirIva}
        <ResultRow etiqueta="Precio sin IVA" valor={formatoMoneda(proyecto.precioSinIva)} />
        <ResultRow etiqueta="IVA (13%)" valor={formatoMoneda(proyecto.iva)} />
      {/if}
      <ResultRow
        etiqueta={incluirIva ? 'Precio a cotizar (con IVA)' : 'Precio a cotizar'}
        valor={formatoMoneda(proyecto.precioConIva)}
        destacado
      />
      {#if proyecto.retencion > 0}
        <ResultRow
          etiqueta="Retención de Renta (10%)"
          descripcion="Sobre el monto sin IVA. El cliente la paga a Hacienda por vos."
          valor={`−${formatoMoneda(proyecto.retencion)}`}
        />
        <ResultRow etiqueta="Lo que recibís" valor={formatoMoneda(proyecto.montoRecibido)} />
      {/if}
    </ResultPanel>
  {/if}

  <div class="rejilla--dos-columnas">
    <ResultPanel titulo="De dónde sale la tarifa (anual)">
      {#if modoBase === 'salario'}
        <ResultRow
          etiqueta="Ingreso neto de un empleado"
          descripcion={`12 salarios netos (${formatoMoneda(empleado.salariosNetos)}) + aguinaldo (${formatoMoneda(empleado.aguinaldo)}) + bono vacacional (${formatoMoneda(empleado.bonoVacacional)}) + Quincena 25 (${formatoMoneda(empleado.quincena25)}).`}
          valor={formatoMoneda(resultado.netoAnual)}
        />
      {:else}
        <ResultRow etiqueta="Ingreso neto deseado" valor={formatoMoneda(resultado.netoAnual)} />
      {/if}
      <ResultRow etiqueta="Gastos del negocio" valor={formatoMoneda(resultado.gastosAnuales)} />
      {#if incluirAportes}
        <ResultRow
          etiqueta="AFP e ISSS como independiente"
          descripcion={`AFP ${formatoMoneda(resultado.aportes.afp)} + ISSS ${formatoMoneda(resultado.aportes.isss)}.`}
          valor={formatoMoneda(resultado.aportes.total)}
        />
      {/if}
      <ResultRow etiqueta={`Margen (${formatoNumero.format(margen)}%)`} valor={formatoMoneda(resultado.montoMargen)} />
      {#if incluirRetencion}
        <ResultRow etiqueta="Retención de Renta (10%)" valor={formatoMoneda(resultado.retencionAnual)} />
      {/if}
      <ResultRow
        etiqueta="Facturación anual necesaria"
        descripcion={incluirIva ? 'Sin IVA.' : ''}
        valor={formatoMoneda(resultado.facturacionAnual)}
        destacado
      />
    </ResultPanel>

    <ResultPanel titulo="Tu tiempo facturable (anual)">
      <ResultRow
        etiqueta="Días laborables"
        descripcion={`${formatoNumero.format(diasPorSemana)} días × 52 semanas.`}
        valor={formatoNumero.format(resultado.horas.diasLaborablesBrutos)}
      />
      <ResultRow
        etiqueta="Días libres"
        descripcion="Vacaciones + feriados + enfermedad."
        valor={`−${formatoNumero.format(resultado.horas.diasLibres)}`}
      />
      <ResultRow etiqueta="Días trabajados" valor={formatoNumero.format(resultado.horas.diasTrabajados)} />
      <ResultRow etiqueta="Horas trabajadas" valor={formatoNumero.format(resultado.horas.horasTrabajadas)} />
      <ResultRow
        etiqueta="Horas facturables"
        descripcion={`${formatoNumero.format(porcentajeFacturable)}% de las horas trabajadas.`}
        valor={formatoNumero.format(resultado.horas.horasFacturables)}
        destacado
      />
    </ResultPanel>
  </div>
{/if}

<p class="nota-legal">
  Herramienta informativa, no constituye asesoría legal, fiscal ni
  financiera. La retención del 10% es un anticipo del Impuesto sobre la
  Renta: tu impuesto real se liquida en la declaración anual y puede
  resultar en un pago adicional o una devolución. Las tasas de AFP e ISSS
  para independientes son estimaciones basadas en la suma de las tasas
  laboral y patronal.
</p>
