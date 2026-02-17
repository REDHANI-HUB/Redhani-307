
import { DensityLevel, CrowdDataPoint, Alert, ParkingSlot, HeatmapCell } from '../types';

/**
 * SIMULATED BACKEND SERVICE
 * In a real environment, these would be fetch calls to the Node.js API
 */
export const api = {
  // GET /api/crowd/overview
  getOverview: async () => {
    return {
      currentCount: 1428,
      density: DensityLevel.MEDIUM,
      alertCount: 3,
      parkingOccupancy: 84
    };
  },

  // GET /api/crowd/temporal
  getTemporalData: async (): Promise<CrowdDataPoint[]> => {
    const data: CrowdDataPoint[] = [];
    const now = new Date();
    for (let i = 12; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      data.push({
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: 1000 + Math.floor(Math.random() * 800),
        expected: 1100 + Math.floor(Math.random() * 400)
      });
    }
    return data;
  },

  // GET /api/crowd/heatmap
  getHeatmapData: async (): Promise<HeatmapCell[]> => {
    const cells: HeatmapCell[] = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        cells.push({
          x,
          y,
          intensity: Math.random()
        });
      }
    }
    return cells;
  },

  // GET /api/parking/status
  getParkingStatus: async (): Promise<ParkingSlot[]> => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: `P-${i}`,
      occupied: Math.random() > 0.3,
      type: i % 10 === 0 ? 'DISABLED' : i % 8 === 0 ? 'EV' : 'STANDARD'
    }));
  },

  // GET /api/alerts
  getAlerts: async (): Promise<Alert[]> => {
    return [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString(),
        type: 'CONGESTION',
        severity: 'DANGER',
        message: 'Extreme density detected at North Gate Exit B.',
        zone: 'North Gate'
      },
      {
        id: '2',
        timestamp: new Date().toLocaleTimeString(),
        type: 'SAFETY',
        severity: 'WARNING',
        message: 'Irregular flow pattern identified in Central Plaza.',
        zone: 'Central Plaza'
      },
      {
        id: '3',
        timestamp: new Date().toLocaleTimeString(),
        type: 'PARKING',
        severity: 'INFO',
        message: 'Parking Sector G is reaching full capacity.',
        zone: 'Sector G'
      }
    ];
  }
};
