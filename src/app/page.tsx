
"use client";

import { useState, useEffect } from "react";
import { Thermometer, Zap, Cpu, MemoryStick, LayoutDashboard, Activity } from "lucide-react";
import { VitalGauge } from "@/components/system-vitals/vital-gauge";
import { Stat } from "@/types/types";

export default function SystemVitalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [stat, setStat] = useState<Stat | null>(null);
  const totalRam = 3.71

  useEffect(() => {
    const fetchData = () => {
      fetch(`http://${window.location.hostname}:4002/stats`).then(
      (response) => {
        return response.json()
      }
    ).then((json: Stat) => {
        setStat(json);
        if (isLoading) {
        setIsLoading(false);
      }
      }).catch(error => console.error('Error fetching data:', error))
    };

    // Initial fetch
    fetchData();
    
    // Setup interval for updates
    const intervalId = setInterval(fetchData, 3000); // Update every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [isLoading]); // Rerun effect if isLoading changes (relevant for initial load)

  const loadAvgMax = 4.00
  const ramFree = totalRam - (stat?.memory ?? 0);

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center space-x-3 mb-2">
           <LayoutDashboard className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
           <h1 className="text-2xl sm:text-3xl font-bold text-primary">Raspberry Pi Stats</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">Real-time monitoring of your raspberry pi metrics.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <VitalGauge
          title="Temperature"
          icon={Thermometer}
          value={stat?.temp ?? 0}
          maxValue={90} 
          unit="°C"
          color="hsl(var(--chart-1))"
          isLoading={isLoading}
          isLoad={false}
          descriptionText="Temperature reading"
        />
        <VitalGauge
          title="Voltage"
          icon={Zap}
          value={stat?.volts ?? 0}
          maxValue={3} 
          unit="V"
          color="hsl(var(--chart-2))"
          isLoading={isLoading}
          isLoad={false}
          descriptionText="CPU core voltage (ARM)"
        />
        <VitalGauge
          title="Load Avg (1m)"
          icon={Activity}
          value={stat?.load_avg_1m ?? 0}
          maxValue={loadAvgMax}
          unit=""
          color="hsl(var(--chart-3))"
          isLoading={isLoading}
          isLoad={true}
          descriptionText="1-minute system load average."
        />
        <VitalGauge
          title="Load Avg (5m)"
          icon={Activity}
          value={stat?.load_avg_5m ?? 0}
          maxValue={loadAvgMax}
          unit=""
          color="hsl(var(--chart-3))" 
          isLoading={isLoading}
          isLoad={true}
          descriptionText="5-minute system load average."
        />
        <VitalGauge
          title="Load Avg (15m)"
          icon={Activity}
          value={stat?.load_avg_15m ?? 0}
          maxValue={loadAvgMax}
          unit=""
          color="hsl(var(--chart-3))"
          isLoading={isLoading}
          isLoad={true}
          descriptionText="15-minute system load average."
        />
        <VitalGauge
          title="RAM Usage"
          icon={MemoryStick}
          value={stat?.memory ?? 0}
          maxValue={totalRam}
          unit="GB"
          color="hsl(var(--chart-4))"
          isLoading={isLoading}
          subText={`${ramFree.toFixed(2)}GB Free`}
          isLoad={false}
          descriptionText={`Used: ${(stat?.memory ?? 0).toFixed(2)}GB / Total: ${totalRam}GB`}
        />
      </div>
    </div>
  );
}

