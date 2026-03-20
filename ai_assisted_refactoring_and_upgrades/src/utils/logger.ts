/**
 * Simple logger utility.
 */
export class Logger {
  static info(message: string): void {
    console.log(`[INFO] ${message}`);
  }

  static error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }

  static debug(message: string): void {
    console.debug(`[DEBUG] ${message}`);
  }
}