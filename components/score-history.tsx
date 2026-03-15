"use client"

import { Card } from "@/components/ui/card"
import { Clock, Zap, Gauge, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface Score {
  time: number
  timestamp: Date
  id: string
}

interface ScoreHistoryProps {
  scores: Score[]
}

export function ScoreHistory({ scores }: ScoreHistoryProps) {
  const getSpeedIcon = (time: number) => {
    if (time < 200) return <Zap className="w-4 h-4 text-primary" />
    if (time < 300) return <Gauge className="w-4 h-4 text-chart-4" />
    return <Timer className="w-4 h-4 text-muted-foreground" />
  }

  const getSpeedBadge = (time: number) => {
    if (time < 200) return { text: "Lightning", className: "bg-primary/20 text-primary" }
    if (time < 250) return { text: "Fast", className: "bg-chart-1/20 text-chart-1" }
    if (time < 300) return { text: "Good", className: "bg-chart-4/20 text-chart-4" }
    if (time < 400) return { text: "Average", className: "bg-secondary text-muted-foreground" }
    return { text: "Slow", className: "bg-accent/20 text-accent" }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recent Attempts</h3>
        </div>
        <span className="text-sm text-muted-foreground">{scores.length} total</span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {scores.slice(0, 10).map((score, index) => {
          const badge = getSpeedBadge(score.time)
          return (
            <div
              key={score.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/50 transition-all",
                index === 0 && "ring-2 ring-primary/30 bg-primary/5"
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
                {getSpeedIcon(score.time)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground tabular-nums">
                    {score.time}ms
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      badge.className
                    )}
                  >
                    {badge.text}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {score.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {index === 0 && (
                <span className="text-xs text-muted-foreground">Latest</span>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
