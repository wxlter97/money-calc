<script>
  let { etiqueta, descripcion = '', valor, destacado = false } = $props();
</script>

<div class="fila-resultado" class:fila-resultado--destacada={destacado}>
  <div class="fila-resultado__texto">
    <span class="fila-resultado__etiqueta">{etiqueta}</span>
    {#if descripcion}
      <span class="fila-resultado__descripcion">{descripcion}</span>
    {/if}
  </div>
  <span class="fila-resultado__valor">{valor}</span>
</div>
