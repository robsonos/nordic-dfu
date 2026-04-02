import { registerPlugin } from '@capacitor/core';
const NordicDfu = registerPlugin('NordicDfu', {
    web: () => import('./web').then((m) => new m.NordicDfuWeb()),
});
export * from './definitions';
export { NordicDfu };
//# sourceMappingURL=index.js.map