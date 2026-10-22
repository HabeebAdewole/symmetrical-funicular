import { Navigate, Outlet } from 'react-router'
import { stageHome, useStage, type Stage } from '@/hooks/useStage'

/**
 * Route guard. Wrap a group of routes with <Gate allow="..." /> and anyone at a
 * different stage is redirected to the right place, e.g. a locked user typing /send lands on /unlock.
 */
export function Gate({ allow }: { allow: Stage }) {
  const stage = useStage()
  return stage === allow ? <Outlet /> : <Navigate to={stageHome[stage]} replace />
}
