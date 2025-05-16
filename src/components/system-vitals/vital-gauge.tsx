
"use client";

import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface VitalGaugeProps {
  title: string;
  icon: LucideIcon;
  value: number;
  maxValue: number;
  unit: string;
  color: string; 
  isLoading: boolean;
  subText?: string;
  descriptionText?: string; 
}

export function VitalGauge({
  title,
  icon: Icon,
  value,
  maxValue,
  unit,
  color,
  isLoading,
  subText,
  descriptionText,
}: VitalGaugeProps) {
  
  const boundedValue = Math.max(0, Math.min(value, maxValue));
  const percentageValue = maxValue > 0 ? (boundedValue / maxValue) * 100 : 0;

  const chartData = [{ name: title, value: percentageValue, fill: `var(--color-arc)` }];

  const chartConfig = {
    arc: { // Changed key to 'arc' to avoid conflict if 'value' is a common data key name
      label: title,
      color: color, 
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Skeleton className="h-5 w-5 rounded-sm" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[250px] p-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-4 w-20 mt-4" />
          {subText && <Skeleton className="h-3 w-24 mt-2" />}
          {descriptionText && <Skeleton className="h-3 w-full max-w-xs mt-2" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-4 pt-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[160px] w-[160px] sm:h-[180px] sm:w-[180px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={210} 
            endAngle={-30} 
            innerRadius="70%"
            outerRadius="90%"
            barSize={18}
            cx="50%"
            cy="55%" 
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar
              dataKey="value"
              background={{ fill: "hsl(var(--muted))" }} 
              cornerRadius={9}
              className="[&>path[name=background]]:stroke-transparent"
              animationDuration={500}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground text-3xl sm:text-4xl font-bold"
            >
              {`${Math.round(boundedValue)}`}
              <tspan dy="-0.3em" dx="0.1em" className="text-sm sm:text-base font-medium align-baseline">{unit}</tspan>
            </text>
            {subText && (
              <text
                x="50%"
                y="72%" 
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-xs sm:text-sm"
              >
                {subText}
              </text>
            )}
          </RadialBarChart>
        </ChartContainer>
        {descriptionText && (
          <p className="text-xs text-muted-foreground text-center mt-1 px-2 h-8 leading-tight">
            {descriptionText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
