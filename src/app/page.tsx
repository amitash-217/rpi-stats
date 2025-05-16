
"use client";

import { useState, useEffect } from "react";
import { Thermometer, Zap, Cpu, MemoryStick, LayoutDashboard } from "lucide-react";
import { VitalGauge } from "@/components/system-vitals/vital-gauge";

// Helper function to generate random data
const getRandomValue = (min: number, max: number, precision: number = 0) => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(precision));
};

export default function SystemVitalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [temp, setTemp] = useState(0);
  const [voltage, setVoltage] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [cpuSpeed, setCpuSpeed] = useState(0);
  const [ramUsed, setRamUsed] = useState(0);
  
  const totalRam = 16; // GB, example value

  useEffect(() => {
    const fetchData = () => {
      setTemp(getRandomValue(20, 90)); 
      setVoltage(getRandomValue(0.8, 1.4, 2)); 
      setCpuUsage(getRandomValue(5, 100)); 
      setCpuSpeed(getRandomValue(1.0, 4.5, 1));
      setRamUsed(getRandomValue(1, totalRam - 1, 1));
      
      if (isLoading) {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();
    
    // Setup interval for updates
    const intervalId = setInterval(fetchData, 3000); // Update every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [isLoading]); // Rerun effect if isLoading changes (relevant for initial load)

  const ramFree = totalRam - ramUsed;

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-6 md:mb-8">
        <div className="flex items-center space-x-3 mb-2">
           <LayoutDashboard className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
           <h1 className="text-2xl sm:text-3xl font-bold text-primary">System Vitals Dashboard</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">Real-time monitoring of your system's key metrics.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <VitalGauge
          title="Temperature"
          icon={Thermometer}
          value={temp}
          maxValue={100} 
          unit="°C"
          color="hsl(var(--chart-1))"
          isLoading={isLoading}
          descriptionText="Core system temperature reading."
        />
        <VitalGauge
          title="Voltage"
          icon={Zap}
          value={voltage}
          maxValue={1.5} 
          unit="V"
          color="hsl(var(--chart-2))"
          isLoading={isLoading}
          descriptionText="CPU core voltage (VCORE)."
        />
        <VitalGauge
          title="CPU Usage"
          icon={Cpu}
          value={cpuUsage}
          maxValue={100}
          unit="%"
          color="hsl(var(--chart-3))"
          isLoading={isLoading}
          subText={`${cpuSpeed.toFixed(1)} GHz`}
          descriptionText="Current CPU load and clock speed."
        />
        <VitalGauge
          title="RAM Usage"
          icon={MemoryStick}
          value={ramUsed}
          maxValue={totalRam}
          unit="GB"
          color="hsl(var(--chart-4))"
          isLoading={isLoading}
          subText={`${ramFree.toFixed(1)}GB Free`}
          descriptionText={`Used: ${ramUsed.toFixed(1)}GB / Total: ${totalRam}GB`}
        />
      </div>
      <footer className="text-center mt-10 md:mt-12 py-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} System Vitals. Designed for clarity and performance.
        </p>
      </footer>
    </div>
  );
}

