# Refactor backlog (Backoffice e Investor)

Generado a partir de una revisión de `apps/backoffice-tokenization`, `apps/investor-tokenization` y código compartido relevante (`packages/*`), siguiendo `rules/DAPPS.mdc`.

## Top oportunidades (priorizadas por esfuerzo)

### 1) I18n: eliminar strings hardcodeadas en diálogos y toasts
**Esfuerzo:** S  
**Impacto:** mejora consistencia UX, reduce “mezcla de idiomas” y evita mensajes no traducidos.
**Evidencia:**
- `apps/backoffice-tokenization/src/features/campaigns/components/roi/UpdateRoiDialog.tsx` (hardcode en `DialogTitle`, `DialogDescription`, `toast.success(...)`, botón y spinner).
- `apps/backoffice-tokenization/src/features/vaults/deploy/dialog/useEnableVault.ts` (hardcode en mensajes de error/toast).
- `apps/investor-tokenization/src/features/tokens/components/InvestDialog.tsx` (errores lanzados/derivados desde strings hardcodeadas; algunos son mostrados directamente al usuario).
**Propuesta:**
1. Pasar todas las strings de UI y errores “usuario-facing” por `useTranslations(...)` (o por el sistema de mensajes equivalente ya existente).
2. Mantener el “fallback” solo para errores verdaderamente inesperados (idealmente también traducible).
**Riesgo:** bajo; requiere solo refactor de mapeo de mensajes, sin tocar lógica de transacción.

---

### 2) Formularios: reemplazar validación manual por `react-hook-form` + `zod`
**Esfuerzo:** S  
**Impacto:** menor riesgo de edge cases, consistencia entre apps, menos lógica ad-hoc por input.
**Evidencia:**
- `apps/backoffice-tokenization/src/features/campaigns/components/roi/FundRoiDialog.tsx` (validación con `Number(amount)` en `handleSubmit`).
- `apps/backoffice-tokenization/src/features/campaigns/components/roi/UpdateRoiDialog.tsx` (validación manual con rangos `0..100`).
**Propuesta:**
1. Crear schemas `zod` para cada formulario (cantidad / porcentaje).
2. Implementar hooks `useForm` y `handleSubmit` en un hook dedicado (o directamente dentro del componente si es trivial).
3. Garantizar que los mensajes de error salgan por `FormMessage`/UI estándar.
**Riesgo:** bajo/medio; revisar compatibilidad con el estado actual (por ejemplo reseteo de `amount`/`percentage` cuando se cierra el diálogo).

---

### 3) Dead code / duplicación de UI: componentes de “campañas” que parecen no usarse
**Esfuerzo:** S  
**Impacto:** menos superficie de mantenimiento y menos confusión sobre cuál patrón usar.
**Evidencia / motivo de sospecha:**
- Backoffice mantiene `apps/backoffice-tokenization/src/features/campaigns/components/campaigns-view.tsx` + `campaign-toolbar.tsx` + `campaign-search.tsx` + `campaign-filter.tsx`, pero los pages usan `SharedCampaignsView` de `packages/features`.
- Investor mantiene `apps/investor-tokenization/src/features/roi/components/campaign-toolbar.tsx` + `campaign-search.tsx` + `campaign-filter.tsx`, pero en `my-investments/page.tsx` se usa `SharedCampaignsView` del paquete (que ya trae toolbar).
**Propuesta:**
1. Confirmar por búsqueda de imports (y/o tests/compilación) que no se usan.
2. Si no se usan: eliminar o convertir en componentes “legacy” claramente marcados.
3. Si se usan en algún route no cubierto: re-engancharlos a `packages/features` para evitar bifurcar el UX.
**Riesgo:** bajo si se valida con build/compilación; medio si existen rutas “raras” no cubiertas.

---

### 4) Eliminar `any` y `eslint-disable` en `ManageLoansView`
**Esfuerzo:** M  
**Impacto:** robustez (tipado real), reduce riesgo de fallos silenciosos y mejora mantenibilidad.
**Evidencia:**
- `apps/backoffice-tokenization/src/features/campaigns/components/loans/manage-loans-view.tsx`:
  - `eslint-disable-next-line @typescript-eslint/no-explicit-any`
  - `const data = (...) as any;`
**Propuesta:**
1. Tipar la respuesta de `getEscrowByContractIds` (o envolverla con un mapper seguro).
2. Evitar asumir `data[0]` sin validaciones de forma (`Array.isArray` + guard clauses).
3. Remover el `eslint-disable` una vez el tipo quede expresado.
**Riesgo:** medio; requiere entender el tipo real que retorna el indexer.

---

### 5) Investor: optimizar invalidación/refetch y manejo de errores en `InvestDialog`
**Esfuerzo:** M  
**Impacto:** performance (menos requests duplicadas), mejora UX ante errores, menos “cascadas” de estado.
**Evidencia:**
- `apps/investor-tokenization/src/features/tokens/components/InvestDialog.tsx`:
  - secuencia repetida:
    - `invalidateQueries(...)` y luego `refetchQueries(...)` para las mismas queryKeys (`balanceQueryKey`, `singleEscrowKey`, `["escrows-by-ids"]`).
  - `console.error("Failed to save investment to database:", dbError);` (no necesariamente usuario-facing).
  - parseo de errores por `message.includes(...)` (heurística frágil).
**Propuesta:**
1. Mantener solo `invalidateQueries(...)` (usualmente suficiente con React Query) o definir `staleTime`/config para evitar refetch inmediato.
2. Centralizar el mapeo de errores de Soroban (o los del core) hacia mensajes traducidos (en vez de heurísticas por substrings).
3. Convertir `console.error` a un logger consistente o manejar el error con toast cuando afecte al usuario.
**Riesgo:** medio; requiere validar comportamiento del cache en la pantalla (carousel/balance/progreso).

---

### 6) Reducir complejidad O(n) y mapeos repetidos en páginas
**Esfuerzo:** S  
**Impacto:** baja pero limpia performance y simplifica lógica.
**Evidencia:**
- `apps/investor-tokenization/src/app/[locale]/my-investments/page.tsx`:
  - `handleClaimRoi` usa `campaigns.find(...)` en cada click.
  - `aggregateByCampaign` realiza una agregación correcta con `Map`, pero el `find` puede volverse O(n) por interacción.
**Propuesta:**
1. Mantener un `Map<string, Campaign>` memoizado por `campaigns` para resolver por id en O(1).
2. (Opcional) similar para backoffice si hay “find/filter” repetidos.
**Riesgo:** bajo.

---

### 7) Consolidar flujo transaccional duplicado (ROI + enable/disable vault)
**Esfuerzo:** M  
**Impacto:** gran mejora de mantenibilidad y reducción de bugs por divergencia.
**Evidencia (patrón repetido):**
- Backoffice:
  - `apps/backoffice-tokenization/src/features/campaigns/hooks/useFundRoi.ts`
  - `apps/backoffice-tokenization/src/features/campaigns/hooks/useUpdateRoiPercentage.ts`
  - `apps/backoffice-tokenization/src/features/campaigns/hooks/useToggleVault.ts`
  - `apps/backoffice-tokenization/src/features/vaults/deploy/dialog/useEnableVault.ts`
- Investor:
  - `apps/investor-tokenization/src/features/claim-roi/hooks/useClaimROI.ts` (builder -> sign -> submit -> toast)
  - `apps/investor-tokenization/src/features/tokens/components/InvestDialog.tsx` también incluye sign+submit, aunque con lógica adicional.
**Comparación rápida del patrón:**
1. Validar wallet conectado.
2. Construir `unsignedXdr`.
3. `signTransaction({ unsignedTransaction, address })`.
4. Enviar:
   - Backoffice: vía `submitSignedTransactionAndWait(...)` (RPC directo) -> parse extra.
   - Investor: vía `SendTransactionService` (API helper).
5. Actualizar queries / toasts.
**Propuesta (a nivel de diseño):**
1. Crear un hook/utility compartido en `packages/*` (posiblemente `packages/shared` o `packages/tw-blocks-shared`) tipo:
   - `useExecuteSignedXdr(...)` o `executeSignedXdr(...)`
2. Parámetros configurables:
   - `buildUnsignedXdr: () => Promise<string>`
   - `submitMode: "directRpc" | "api"`
   - `onSuccess`, `onError`, `queryInvalidations` (opcional)
3. Reutilizarlo en todos los hooks anteriores.
**Riesgo:** medio; hay dos modos de envío (direct RPC vs API), pero el diseño puede unificarse con adaptadores.

---

### 8) Consolidar UI de “CampaignCard” entre Backoffice e Investor
**Esfuerzo:** L  
**Impacto:** reduce duplicación de lógica, asegura consistencia visual y minimiza divergencias.
**Evidencia (duplicación):**
- Backoffice: `apps/backoffice-tokenization/src/components/shared/campaign-card.tsx`
- Investor: `apps/investor-tokenization/src/components/shared/campaign-card.tsx`
Ambos renderizan:
- status badge (via `getCampaignStatusConfig`)
- milestones (misma lógica de flags `approved/released`)
- query para obtener escrow milestones/balance (misma estructura de `useQuery` por card)
**Propuesta:**
1. Extraer a `packages/features` o `packages/ui` una `CampaignCard` parametrizable:
   - `cardMode: "backoffice" | "investor"`
   - callbacks: `onManageLoans?(id)`, `onClaimRoi?(id)` o `actionsSlot`
   - label/formatters de footer (balance/poolSize)
2. Mantener la lógica compartida de milestones y el “fetch de escrow” en un solo lugar.
**Riesgo:** medio/alto; requiere definir API de componentes y validar el mapping entre los tipos de campaña (backoffice vs investor).

---

### 9) Modularizar componentes monolíticos: `ManageLoansView` e `InvestDialog`
**Esfuerzo:** L  
**Impacto:** reduce complejidad ciclomática y facilita testing/iteración.
**Evidencia:**
- `apps/backoffice-tokenization/src/features/campaigns/components/loans/manage-loans-view.tsx` (fetch + approve/release + dialogs + add milestone en un solo componente).
- `apps/investor-tokenization/src/features/tokens/components/InvestDialog.tsx` (wizard trustline/buy + múltiples renders + invalidations + persistencia + cálculo estimaciones).
**Propuesta:**
1. Extraer subcomponentes:
   - “Milestones list”
   - “Approve/Release action”
   - “Change status dialog”
   - “Add milestone form”
2. Extraer hooks:
   - `useManageLoans` / `useInvestFlow` para orquestación de pasos + estado.
3. Mantener componentes de UI “presentacionales” (según `DAPPS.mdc`).
**Riesgo:** alto; aunque es refactor, tocará props/estado y requiere buena regresión manual.

---

## Roadmap sugerido

### Fase 1 (rápida, bajo riesgo)
- I18n: eliminar hardcode en `UpdateRoiDialog` y mensajes usuario-facing.
- Migrar `FundRoiDialog` + `UpdateRoiDialog` a `react-hook-form` + `zod`.
- Remover dead code de toolbars/views duplicadas que no se usan.
- Pequeñas optimizaciones (Map para lookups en `my-investments/page.tsx`).

### Fase 2 (mantenibilidad + performance)
- Quitar `any`/`eslint-disable` en `ManageLoansView`.
- Reducir invalidation/refetch duplicado en `InvestDialog`.
- Diseñar/introducir abstracción de ejecución transaccional (sin implementarla aún si se requiere una coordinación fina).

### Fase 3 (consolidación fuerte)
- Unificar `CampaignCard` en `packages/*`.
- Modularizar `ManageLoansView` e `InvestDialog` con hooks/subcomponents.
- Extraer una capa unificada de “submit signed transaction + onSuccess/onError + toast” para ambos apps.

## Candidatos “de apoyo” (verificar)
- `packages/shared/src/lib/contractErrorHandler.ts`: revisar si está muerto.
  - `extractContractError` no parece referenciarse desde `apps/backoffice-tokenization` ni `apps/investor-tokenization`.

