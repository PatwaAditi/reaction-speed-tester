"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap, Trophy, Clock, TrendingUp, RotateCcw, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { HistoryChart } from "@/components/history-chart"
import { Leaderboard } from "@/components/leaderboard"
import { ScoreHistory } from "@/components/score-history"

type GameState = "idle" | "waiting" | "ready" | "result" | "too-early"

interface Score {
  time: number
  timestamp: Date
  id: string
}

export function ReactionGame() {
  const [gameState, setGameState] = useState<GameState>("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [scores, setScores] = useState<Score[]>([])
  const [countdown, setCountdown] = useState<string>("")
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const startGame = useCallback(() => {
    clearTimeouts()
    setGameState("waiting")
    setReactionTime(null)
    setCountdown("Wait for green...")

    const delay = Math.random() * 4000 + 1500 // 1.5-5.5 seconds

    timeoutRef.current = setTimeout(() => {
      setGameState("ready")
      setCountdown("CLICK NOW!")
      startTimeRef.current = performance.now()
    }, delay)
  }, [clearTimeouts])

  const handleClick = useCallback(() => {
    if (gameState === "waiting") {
      clearTimeouts()
      setGameState("too-early")
      setCountdown("Too early!")
    } else if (gameState === "ready") {
      const endTime = performance.now()
      const time = Math.round(endTime - startTimeRef.current)
      setReactionTime(time)
      setGameState("result")

      const newScore: Score = {
        time,
        timestamp: new Date(),
        id: crypto.randomUUID(),
      }
      setScores((prev) => [newScore, ...prev].slice(0, 20))
    }
  }, [gameState, clearTimeouts])

  const resetGame = useCallback(() => {
    clearTimeouts()
    setGameState("idle")
    setReactionTime(null)
    setCountdown("")
  }, [clearTimeouts])

  useEffect(() => {
    return () => clearTimeouts()
  }, [clearTimeouts])

  const bestScore = scores.length > 0 ? Math.min(...scores.map((s) => s.time)) : null
  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((acc, s) => acc + s.time, 0) / scores.length)
      : null

  const getReactionFeedback = (time: number) => {
    if (time < 200) return { text: "Incredible!", color: "text-primary" }
    if (time < 250) return { text: "Fast!", color: "text-chart-1" }
    if (time < 300) return { text: "Good!", color: "text-chart-4" }
    if (time < 400) return { text: "Average", color: "text-muted-foreground" }
    return { text: "Keep practicing!", color: "text-accent" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full Screen Game Area */}
      <div
        onClick={gameState === "waiting" || gameState === "ready" ? handleClick : undefined}
        className={cn(
          "relative min-h-[60vh] lg:min-h-[50vh] flex items-center justify-center transition-all duration-300 cursor-default",
          gameState === "idle" && "bg-background",
          gameState === "waiting" && "bg-accent/90 cursor-pointer",
          gameState === "ready" && "bg-primary cursor-pointer animate-pulse",
          gameState === "result" && "bg-card",
          gameState === "too-early" && "bg-destructive/90"
        )}
      >
        <div className="text-center px-4">
          {gameState === "idle" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50 border border-border">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Test Your Reflexes
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight text-balance">
                Reaction Speed
                <br />
                <span className="text-primary">Tester</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Click as fast as you can when the screen turns green
              </p>
              <Button
                onClick={startGame}
                size="lg"
                className="h-16 px-12 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-105 active:scale-95"
              >
                <Target className="w-6 h-6 mr-3" />
                Start Test
              </Button>
            </div>
          )}

          {gameState === "waiting" && (
            <div className="space-y-4 animate-in zoom-in duration-300">
              <div className="w-24 h-24 mx-auto rounded-full bg-accent-foreground/20 flex items-center justify-center animate-pulse">
                <Clock className="w-12 h-12 text-accent-foreground" />
              </div>
              <p className="text-3xl md:text-5xl font-bold text-accent-foreground">
                {countdown}
              </p>
              <p className="text-accent-foreground/70">
                Click anywhere when the screen turns green
              </p>
            </div>
          )}

          {gameState === "ready" && (
            <div className="space-y-4 animate-in zoom-in duration-150">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Zap className="w-12 h-12 text-primary-foreground" />
              </div>
              <p className="text-4xl md:text-6xl font-bold text-primary-foreground animate-bounce">
                {countdown}
              </p>
            </div>
          )}

          {gameState === "too-early" && (
            <div className="space-y-6 animate-in shake duration-300">
              <div className="w-24 h-24 mx-auto rounded-full bg-destructive-foreground/20 flex items-center justify-center">
                <RotateCcw className="w-12 h-12 text-destructive-foreground" />
              </div>
              <p className="text-3xl md:text-5xl font-bold text-destructive-foreground">
                Too Early!
              </p>
              <p className="text-destructive-foreground/80">
                Wait for the green screen before clicking
              </p>
              <Button
                onClick={resetGame}
                size="lg"
                variant="secondary"
                className="mt-4"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {gameState === "result" && reactionTime !== null && (
            <div className="space-y-6 animate-in zoom-in-50 duration-500">
              <div
                className={cn(
                  "text-2xl font-semibold",
                  getReactionFeedback(reactionTime).color
                )}
              >
                {getReactionFeedback(reactionTime).text}
              </div>
              <div className="space-y-2">
                <p className="text-7xl md:text-9xl font-bold text-foreground tabular-nums">
                  {reactionTime}
                </p>
                <p className="text-xl text-muted-foreground">milliseconds</p>
              </div>
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Play Again
                </Button>
                <Button onClick={resetGame} size="lg" variant="outline">
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats and History Section */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Quick Stats */}
        {scores.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in-50 duration-500">
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {bestScore}ms
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-2/10">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {avgScore}ms
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-3/10">
                  <Target className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attempts</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {scores.length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Clock className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last</p>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {scores[0]?.time ?? "-"}ms
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Charts and Lists */}
        {scores.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <HistoryChart scores={scores} />
              <ScoreHistory scores={scores} />
            </div>
            <div>
              <Leaderboard scores={scores} />
            </div>
          </div>
        )}

        {/* Empty State */}
        {scores.length === 0 && (
          <Card className="p-12 text-center bg-card/50 border-border border-dashed">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  No scores yet
                </h3>
                <p className="text-muted-foreground">
                  Start a test to see your reaction time history
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
