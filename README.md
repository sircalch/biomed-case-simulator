## BioMed Case Simulator Web

Aplicacion web para practicar resolucion de fallas de equipos medicos con flujo guiado por etapas.

### Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- JSON local para escenarios
- localStorage para guardar ultimo resultado, historial local y notas por caso
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
  CaseHistoryClient.tsx
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

1. Explorar el equipo relacionado en BioMed 3D Engineering Lab cuando aplique.
2. Seleccionar caso.
3. Revisar reporte inicial.
4. Analizar pistas.
5. Elegir causa probable.
6. Elegir herramienta.
7. Elegir accion.
8. Responder pregunta contextual.
9. Revisar resultado final con puntaje y feedback.
10. Exportar evidencia JSON o registrar reporte tecnico.

### Casos incluidos

- Monitor sin lectura de SpO2
- Bomba de infusion con alarma de oclusion
- Desfibrilador no carga energia
- Incubadora con temperatura inestable
- Autoclave no alcanza presion

### Integracion BioMedTools MX Core

La raiz acepta `?category=<categoria>` desde Quiz Arena y redirige al caso recomendado.

Ejemplos:

- `/?category=monitoreo-signos-vitales` -> monitor sin lectura de SpO2
- `/?category=bombas-infusion-terapia` -> bomba con alarma de oclusion
- `/?category=desfibrilador-urgencias` -> desfibrilador no carga energia

Al finalizar un caso, el resultado incluye enlace a Report Builder:

```txt
NEXT_PUBLIC_REPORT_BUILDER_URL/builder/corrective?activity=case&caseId=<id>&equipment=<equipo>&score=<puntaje>
```

Durante el caso y al finalizarlo tambien se puede abrir el equipo relacionado en BioMed 3D Engineering Lab:

```txt
NEXT_PUBLIC_BIOMED_3D_LAB_URL?equipment=<equipo-3d>&caseCategory=<id>
```

### Evidencia local

La pantalla `/results` permite:

- ver ultimo resultado guardado
- revisar historial local de intentos
- exportar historial en JSON o CSV
- conservar notas por caso
- repetir un caso desde el historial

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
- `SUPABASE_SERVICE_ROLE_KEY` (`sb_secret_...` recomendado para backend; tambien acepta `service_role` JWT legacy)
- `SUPABASE_CASE_RUNS_TABLE` (opcional, default: `simulation_runs`)
- `NEXT_PUBLIC_CORE_URL` (opcional, default: `https://biomedtools-mx-core.vercel.app`)
- `NEXT_PUBLIC_QUIZ_ARENA_URL` (opcional, default: `https://biomed-quiz-arena.vercel.app`)
- `NEXT_PUBLIC_REPORT_BUILDER_URL` (opcional, default: `https://clinical-report-builder.vercel.app`)
- `NEXT_PUBLIC_BIOMED_3D_LAB_URL` (opcional, default: `https://biomed-3d-engineering-lab.vercel.app`)
- `NEXT_PUBLIC_SITE_URL` (opcional, usado para metadata publica)

Schema sugerido: `supabase/schema.sql`

### Recursos visuales

- Iconografia tecnica: Lucide React.
- Iconos de salud incluidos en `public/assets/health-icons`: Health Icons.
- Referencias visuales abiertas consultadas: Bioicons, Health Icons y NIH BioArt.
- Atlas de equipos: asset local compartido con BioMedTools MX Core.

### Seguridad de rutas internas

La ruta `/about` esta protegida con HTTP Basic Auth en `proxy.ts`.

- `INTERNAL_ROUTE_USER`
- `INTERNAL_ROUTE_PASSWORD`
- `NEXT_PUBLIC_SHOW_INTERNAL_NAV` (opcional, `true` para mostrar link interno en el menu)

### Calidad del repositorio

- CI en GitHub Actions: `npm ci`, `npm run lint`, `npm run build` y `npm audit --audit-level=high`.
- Variables documentadas en `.env.example`.
- Politica de seguridad en `SECURITY.md`.
- Metadata Open Graph/Twitter configurada para enlaces compartidos.
- Trazabilidad de recursos externos en `THIRD_PARTY_NOTICES.md`.

### Ejecutar local

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000` o el puerto disponible.
