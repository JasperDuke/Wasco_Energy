'use client';

import { useEffect, useRef } from 'react';
import { ApplicationStatus } from '@/types';

/** Statuses where Atenxion/callback may still update the application. */
export const PENDING_REVIEW_STATUSES: ApplicationStatus[] = [
  'pending',
  'pending_approval',
  'submitted',
  'processing',
  'proposal_under_review',
];

export const APPLICATION_POLL_INTERVAL_MS = 8_000;

export function isPendingReviewStatus(status: ApplicationStatus | undefined | null): boolean {
  if (!status) return false;
  return PENDING_REVIEW_STATUSES.includes(status);
}

export function hasPendingReviewApplications(
  applications: Array<{ status: ApplicationStatus }>
): boolean {
  return applications.some((app) => isPendingReviewStatus(app.status));
}

/**
 * Silently re-fetches while `enabled` is true.
 * Does not toggle loading UI — intended for in-review polling.
 */
export function usePollingRefresh(
  enabled: boolean,
  refresh: () => void | Promise<void>,
  intervalMs: number = APPLICATION_POLL_INTERVAL_MS
): void {
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async () => {
      try {
        await refreshRef.current();
      } catch {
        // Keep polling; transient network errors should not stop updates.
      }
      if (!cancelled) {
        timer = setTimeout(tick, intervalMs);
      }
    };

    timer = setTimeout(tick, intervalMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [enabled, intervalMs]);
}
