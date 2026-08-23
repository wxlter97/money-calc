<script>
  let { titulo, children } = $props();
</script>

<div class="tarjeta panel-resultado">
  <h3>{titulo}</h3>
  {@render children()}
</div>
