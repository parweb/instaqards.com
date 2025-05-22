export type CronExecutionOptions = {
  manual?: boolean;
  timeoutMs?: number;
};

export type CronExecutionResult = {
  success: boolean;
  duration: number;
  result?: any;
  error?: string;
};
