export interface PipelineTelemetry {
  totalDurationMs: number;
  extractionMs?: number;
  aiSummaryMs?: number;
  aiFlashcardsMs?: number;
  aiQuizMs?: number;
  estimatedTokens?: number;
  tokensPerSecond?: number;
  provider?: string;
}

export class TelemetryTimer {
  private startTime: number;
  private marks: Map<string, number> = new Map();

  constructor() {
    this.startTime = performance.now();
  }

  /**
   * Sets a checkpoint timestamp with a label.
   */
  mark(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * Measures duration between start or a specific mark to now in milliseconds.
   */
  measure(fromMark?: string): number {
    const fromTime = fromMark ? this.marks.get(fromMark) ?? this.startTime : this.startTime;
    return Math.round(performance.now() - fromTime);
  }

  /**
   * Calculates throughput in tokens per second.
   */
  static calculateThroughput(tokens: number, durationMs: number): number {
    if (durationMs <= 0) return 0;
    return Math.round((tokens / durationMs) * 1000);
  }

  /**
   * Generates a standard W3C Server-Timing header string.
   */
  static formatServerTiming(metrics: Record<string, number>): string {
    return Object.entries(metrics)
      .map(([key, value]) => `${key};dur=${value}`)
      .join(", ");
  }
}
