<script>
  let { titulo = null } = $props();
</script>

<header class="app-header">
  <a class="app-header__marca" href="#/">
    <svg class="app-header__mark" viewBox="0 0 100 100" width="26" height="26" aria-hidden="true">
      <rect width="100" height="100" fill="#111111" />
      <polyline
        points="14,24 32,76 50,44 68,76 86,24"
        fill="none"
        stroke="#FFDB00"
        stroke-width="15"
        stroke-linejoin="miter"
      />
    </svg>
    Money Calc
  </a>
  {#if titulo}
    <a class="boton-texto" href="#/">Inicio</a>
  {/if}
</header>
