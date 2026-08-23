# Money Calc

Calculadoras de salario, prestaciones y descuentos de ley para El Salvador,
construidas con [Svelte](https://svelte.dev) y [Vite](https://vite.dev).

## Calculadoras

- **Salario y descuentos de ley** — salario neto mensual y quincenal (AFP,
  ISSS, Renta), más aguinaldo, bono vacacional y Quincena 25.
- **Horas extra** — tarifa por hora y pago de horas extra diurnas,
  nocturnas y en día libre.

## Desarrollo

```bash
npm install
npm run dev
```

```bash
npm run build    # genera dist/
npm run preview  # sirve el build de producción localmente
```

## Arquitectura

- `src/lib/` — funciones puras de cálculo (sin dependencias de Svelte),
  fáciles de probar de forma aislada.
- `src/components/` — piezas de UI reutilizadas por cualquier calculadora
  (tarjetas, filas de resultado, campos de formulario).
- `src/calculators/` — una carpeta por calculadora, cada una compuesta a
  partir de `lib/` y `components/`.
- `src/registry.js` — lista única de calculadoras; la navegación, la
  página de inicio y el enrutador (basado en `location.hash`) se generan
  a partir de ella. Agregar una calculadora nueva es: un archivo en
  `lib/`, un componente en `calculators/`, y una línea en `registry.js`.

## Fuentes legales

- Código de Trabajo de El Salvador (Art. 161, 162, 168, 169, 198, 200).
- Ley del Sistema de Ahorro para Pensiones (Art. 16).
- Ley del Seguro Social (tasas y tope de cotización del ISSS).
- Tabla de retención de Impuesto Sobre la Renta vigente desde el Decreto
  Legislativo No. 10 (30 de abril de 2025, Diario Oficial Tomo 447).

Esta herramienta es informativa y no constituye asesoría legal ni fiscal.

## Despliegue

Un workflow de GitHub Actions (`.github/workflows/deploy.yml`) construye el
sitio y lo publica en GitHub Pages en cada push a `main`.
