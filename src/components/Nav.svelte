<script>
  let { titulo = null } = $props();
</script>

<header class="app-header">
  <a class="app-header__marca" href="#/">💵 Money Calc</a>
  {#if titulo}
    <a class="boton-texto" href="#/">Inicio</a>
  {/if}
</header>
