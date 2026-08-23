<script>
  let { etiqueta, ayuda = '', children } = $props();
</script>

<label class="campo">
  <span class="campo__etiqueta">{etiqueta}</span>
  {@render children()}
  {#if ayuda}
    <span class="campo__ayuda">{ayuda}</span>
  {/if}
</label>
