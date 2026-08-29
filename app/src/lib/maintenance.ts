// CivicLens — Deterministic Maintenance Calculation
// NEVER use AI for this — pure application logic per SRS Section 7

import { addMonths, isAfter } from 'date-fns';
import type { MaintenanceStatus } from './types';

/**
 * Calculate maintenance status using deterministic logic.
 * 
 * maintenanceEnd = completionDate + maintenanceMonths
 * if currentDate <= maintenanceEnd: ACTIVE
 * else: EXPIRED
 */
export function calculateMaintenanceStatus(
  completionDate: string,
  maintenanceMonths: number
): { status: MaintenanceStatus; endDate: Date } {
  const completion = new Date(completionDate);
  const maintenanceEnd = addMonths(completion, maintenanceMonths);
  const now = new Date();

  return {
    status: isAfter(now, maintenanceEnd) ? 'EXPIRED' : 'ACTIVE',
    endDate: maintenanceEnd,
  };
}

/**
 * Format maintenance status for display.
 * Always prefixed with "Simulated" per spec.
 */
export function formatMaintenanceDisplay(
  completionDate: string,
  maintenanceMonths: number
): {
  status: MaintenanceStatus;
  displayText: string;
  endDate: string;
  remainingMonths: number;
} {
  const { status, endDate } = calculateMaintenanceStatus(completionDate, maintenanceMonths);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  const remainingMonths = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30)));

  return {
    status,
    displayText: `Simulated maintenance period: ${status}`,
    endDate: endDate.toISOString().split('T')[0],
    remainingMonths,
  };
}
