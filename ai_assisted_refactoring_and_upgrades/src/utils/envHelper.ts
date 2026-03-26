/**
 * Utility to safely access environment variables.
 */
export const getEnv = (key: string): string => {
  if (key == null) {
    return '';
  }

  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};