
export enum DensityLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface CrowdDataPoint {
  timestamp: string;
  count: number;
  expected: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'CONGESTION' | 'SAFETY' | 'PARKING';
  severity: 'WARNING' | 'DANGER' | 'INFO';
  message: string;
  zone: string;
}

export interface ParkingSlot {
  id: string;
  occupied: boolean;
  type: 'STANDARD' | 'DISABLED' | 'EV';
}

export interface HeatmapCell {
  x: number;
  y: number;
  intensity: number; // 0 to 1
}

export interface PredictionResult {
  riskScore: number;
  forecastedCount: number;
  recommendations: string[];
}
