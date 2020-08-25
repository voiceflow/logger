import { Level } from 'pino';

export default function convertLevel(level: string | null | undefined): Level {
  switch (level) {
    case 'trace':
      return 'trace';

    case 'info':
      return 'info';

    case 'warn':
      return 'warn';

    case 'error':
      return 'error';

    case 'fatal':
      return 'fatal';

    default:
      return 'info';
  }
}
