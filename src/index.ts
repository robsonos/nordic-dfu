import { registerPlugin } from '@capacitor/core';

import type { NordicDfuPlugin } from './definitions';

const NordicDfu = registerPlugin<NordicDfuPlugin>('NordicDfu', {
  web: () => import('./web').then((m) => new m.NordicDfuWeb()),
});

export * from './definitions';
export { NordicDfu };
