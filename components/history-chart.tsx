"use client"

import { Card } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart } from "recharts"
import { TrendingUp } from "lucide-react"

interface Score {
  time: number
  timestamp: Date
  id: string
}

interface HistoryChartProps {
  scores: Score[]
}

export function HistoryChart({ scores }: HistoryChartProps) {
  const chartData = [...scores]
    .reverse()
    .map((score, index) => ({
      attempt: index + 1,
      time: score.time,
    }))

  const avgTime = scores.length > 0
    ? Math.round(scores.reduce((acc, s) => acc + s.time, 0) / scores.length)
    : 0

  const chartConfig = {
    time: {
      label: "Reaction Time",
      color: "var(--chart-1)",
    },
  }

  if (scores.length < 2) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Performance Trend</h3>
        </div>
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Complete at least 2 attempts to see your trend
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Performance Trend</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          Avg: <span className="font-semibold text-foreground">{avgTime}ms</span>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis
            dataKey="attempt"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            label={{ value: "Attempt", position: "bottom", fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            domain={["dataMin - 20", "dataMax + 20"]}
            tickFormatter={(value) => `${value}ms`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`${value}ms`, "Reaction Time"]}
                labelFormatter={(label) => `Attempt ${label}`}
              />
            }
          />
          <ReferenceLine
            y={avgTime}
            stroke="var(--chart-2)"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="time"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fill="url(#colorTime)"
            dot={{ fill: "var(--chart-1)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "var(--chart-1)" }}
          />
        </AreaChart>
      </ChartContainer>
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-1 rounded" />
          <span>Your times</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-2 rounded border-dashed" />
          <span>Average ({avgTime}ms)</span>
        </div>
      </div>
    </Card>
  )
}
