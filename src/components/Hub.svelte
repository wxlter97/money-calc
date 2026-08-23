<script>
  let { calculadoras } = $props();
</script>

<section class="vista-hub">
  <h1>Money Calc</h1>
  <p>
    Calculadoras de salario, prestaciones y descuentos de ley basadas en el
    Código de Trabajo y la Ley de Impuesto Sobre la Renta de El Salvador.
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
