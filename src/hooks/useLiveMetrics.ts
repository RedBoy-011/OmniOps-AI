import { useState, useEffect, useCallback, useRef } from 'react';

export interface ClusterMetrics {
  cpuUsage: number;
  ramUsedGb: number;
  ramTotalGb: number;
  diskUsedGb: number;
  diskTotalGb: number;
  aiThroughput: number;
  activeNodesCount: number;
  activeAgentsCount: number;
  nodeLatencies: {
    master: number;
    edgeGpu: number;
    winWorkstation: number;
    winLaptop: number;
  };
  lastRefreshedAt: string;
  isPulsing: boolean;
}

export function useLiveMetrics(initialLiveState = true, intervalMs = 2500) {
  const [isLive, setIsLive] = useState<boolean>(initialLiveState);
  const [pulseCounter, setPulseCounter] = useState(0);

  const [metrics, setMetrics] = useState<ClusterMetrics>({
    cpuUsage: 12,
    ramUsedGb: 1.4,
    ramTotalGb: 16,
    diskUsedGb: 48,
    diskTotalGb: 250,
    aiThroughput: 142,
    activeNodesCount: 4,
    activeAgentsCount: 2,
    nodeLatencies: {
      master: 18,
      edgeGpu: 24,
      winWorkstation: 14,
      winLaptop: 22
    },
    lastRefreshedAt: 'هم‌اکنون',
    isPulsing: false
  });

  const generateFluctuation = useCallback(() => {
    setMetrics(prev => {
      // Fluctuations that stay realistic and smooth
      const cpuDelta = (Math.random() * 6 - 3);
      const newCpu = Math.min(32, Math.max(8, Math.round(prev.cpuUsage + cpuDelta)));

      const ramDelta = (Math.random() * 0.4 - 0.2);
      const newRam = Math.min(4.5, Math.max(1.2, +(prev.ramUsedGb + ramDelta).toFixed(1)));

      const throughputDelta = Math.floor(Math.random() * 14 - 7);
      const newThroughput = Math.min(185, Math.max(115, prev.aiThroughput + throughputDelta));

      const now = new Date();
      const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      return {
        ...prev,
        cpuUsage: newCpu,
        ramUsedGb: newRam,
        aiThroughput: newThroughput,
        nodeLatencies: {
          master: Math.floor(16 + Math.random() * 5),
          edgeGpu: Math.floor(22 + Math.random() * 7),
          winWorkstation: Math.floor(12 + Math.random() * 6),
          winLaptop: Math.floor(19 + Math.random() * 8)
        },
        lastRefreshedAt: timeString,
        isPulsing: true
      };
    });

    setPulseCounter(c => c + 1);

    // Turn off pulse glow after 400ms
    setTimeout(() => {
      setMetrics(prev => ({ ...prev, isPulsing: false }));
    }, 450);
  }, []);

  // Interval-based live auto refresh
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      generateFluctuation();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isLive, intervalMs, generateFluctuation]);

  // Manual trigger for refresh button
  const triggerManualRefresh = useCallback(() => {
    generateFluctuation();
  }, [generateFluctuation]);

  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  return {
    metrics,
    isLive,
    setIsLive,
    toggleLive,
    triggerManualRefresh,
    pulseCounter
  };
}
