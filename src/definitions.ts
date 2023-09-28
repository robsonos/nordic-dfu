export interface NordicDfuPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
