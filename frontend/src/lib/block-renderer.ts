import type { Block } from './types';

export const SUPPORTED_BLOCKS = new Set([
  'shared.rich-text',
  'shared.media',
  'shared.quote',
  'shared.slider',
]);

export function isSupportedBlock(block: Block | { __component: string }): boolean {
  return SUPPORTED_BLOCKS.has(block.__component);
}
