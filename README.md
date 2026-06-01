## BioMed Case Simulator Web

MVP web para practicar resolucion de fallas de equipos medicos con flujo guiado por etapas.

### Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- JSON local para escenarios
- localStorage para guardar ultimo resultado
- API interna para corridas y telemetria

### Estructura principal

```txt
app/
  page.tsx
  cases/page.tsx
  cases/[id]/page.tsx
  results/page.tsx
  about/page.tsx
components/
  CaseSimulation.tsx
  CaseCard.tsx
  StepProgress.tsx
  OptionCard.tsx
  FeedbackBox.tsx
  FinalCaseReport.tsx
  EquipmentMiniCard.tsx
  LatestResultClient.tsx
data/
  cases.json
lib/
  case-engine.ts
  scoring.ts
  storage.ts
types/
  case.ts
```

### Flujo del simulador

1. Seleccionar caso.
2. Revisar reporte inicial.
3. Analizar pistas.
4. Elegir causa probable.
5. Elegir herramienta.
6. Elegir accion.
7. Responder pregunta contextual.
8. Revisar resultado final con puntaje y feedback.

### Casos incluidos

- Monitor sin lectura de SpO2
- Bomba de infusion con alarma de oclusion
- Desfibrilador no carga energia
- Incubadora con temperatura inestable
- Autoclave no alcanza presion

### Scripts

- `npm run dev` entorno local
- `npm run lint` validacion ESLint
- `npm run build` build de produccion

### API interna (App Router)

- `GET /api/cases` lista casos (filtros: `q`, `difficulty`, `limit`)
- `GET /api/simulations/runs` consulta corridas recientes (`limit`)
- `POST /api/simulations/runs` registra una corrida del simulador
- `GET /api/simulations/stats` resumen de desempeno global

### Persistencia opcional (Supabase)

Si defines estas variables, las corridas se guardan en Supabase.  
Sin variables, se usa memoria del proceso (ephemeral).

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CASE_RUNS_TABLE` (opcional, default: `simulation_runs`)

Schema sugerido: `supabase/schema.sql`

### Seguridad de rutas internas

La ruta `/about` esta protegida con HTTP Basic Auth en `proxy.ts`.

- `INTERNAL_ROUTE_USER`
- `INTERNAL_ROUTE_PASSWORD`
- `NEXT_PUBLIC_SHOW_INTERNAL_NAV` (opcional, `true` para mostrar link interno en el menu)

### Ejecutar local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000` o el puerto disponible.
