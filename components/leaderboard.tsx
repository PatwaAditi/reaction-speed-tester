"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface Score {
  time: number
  timestamp: Date
  id: string
}

interface LeaderboardProps {
  scores: Score[]
}

export function Leaderboard({ scores }: LeaderboardProps) {
  const sortedScores = [...scores]
    .sort((a, b) => a.time - b.time)
    .slice(0, 10)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">
            {rank}
          </span>
        )
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/10 border-yellow-500/30"
      case 2:
        return "bg-gray-400/10 border-gray-400/30"
      case 3:
        return "bg-amber-600/10 border-amber-600/30"
      default:
        return "bg-secondary/50 border-border"
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Best Scores</h3>
      </div>
      <div className="space-y-2">
        {sortedScores.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No scores yet
          </p>
        ) : (
          sortedScores.map((score, index) => (
            <div
              key={score.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all hover:scale-[1.02]",
                getRankStyle(index + 1),
                index < 3 && "animate-in fade-in-50 duration-300"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index + 1)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground tabular-nums">
                  {score.time}ms
                </p>
                <p className="text-xs text-muted-foreground">
                  {score.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {index === 0 && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/20 text-primary">
                  BEST
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
