import { useMemo } from 'react';
import { parseDemoDeadline } from '../utils/schemeUtils';

export function useDeadlineItems(schemes) {
  return useMemo(() => schemes
    .map(scheme => ({ ...scheme, parsedDeadline: parseDemoDeadline(scheme.deadline) }))
    .filter(scheme => scheme.parsedDeadline && scheme.parsedDeadline >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => a.parsedDeadline - b.parsedDeadline), [schemes]);
}
