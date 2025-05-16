
"use client";

import { useState, useEffect } from "react";
import { Thermometer, Zap, Cpu, MemoryStick, LayoutDashboard } from "lucide-react";
import { VitalGauge } from "@/components/system-vitals/vital-gauge";
import { Stat } from "@/types/types";

// Helper function to generate random data
const getRandomValue = (min: number, max: number, precision: number = 0) => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(precision));
};

export default function SystemVitalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [stat, setStat] = useState<Stat | null>(null);
  const totalRam = 3.71
  const maxCpu = 2.147

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
    const intervalId = setInterval(fetchData, 5000); // Update every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [isLoading]); // Rerun effect if isLoading changes (relevant for initial load)

  const ramFree = totalRam - (stat?.memory ?? 0);
  const cpuUsage = ((stat?.clock_speed ?? 0) / maxCpu) * 100

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
          descriptionText="CPU core voltage (ARM)"
        />
        <VitalGauge
          title="CPU Usage"
          icon={Cpu}
          value={cpuUsage}
          maxValue={100}
          unit="%"
          color="hsl(var(--chart-3))"
          isLoading={isLoading}
          subText={`${(stat?.clock_speed ?? 0).toFixed(2)} GHz`}
          descriptionText="Current CPU load and clock speed"
        />
        <VitalGauge
          title="RAM Usage"
          icon={MemoryStick}
          value={stat?.memory ?? 0}
          maxValue={totalRam}
          unit="GB"
          color="hsl(var(--chart-4))"
          isLoading={isLoading}
          subText={`${ramFree.toFixed(1)}GB Free`}
          descriptionText={`Used: ${(stat?.memory ?? 0).toFixed(2)}GB / Total: ${totalRam}GB`}
        />
      </div>
    </div>
  );
}

