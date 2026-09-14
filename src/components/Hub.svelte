<script>
  let { calculadoras } = $props();
</script>

<section class="vista-hub">
  <h1>Money Calc</h1>
  <p>
    Calculadoras de salario, prestaciones y descuentos de ley de El Salvador,
    junto con herramientas financieras de uso general: préstamos, ahorro,
    inversión y planificación.
  </p>
</section>

<div class="rejilla">
  {#each calculadoras as calc (calc.slug)}
    <a class="tarjeta tarjeta--enlace" href="#/{calc.slug}">
      <h2>{calc.titulo}</h2>
      <p>{calc.resumen}</p>
    </a>
  {/each}
</div>
