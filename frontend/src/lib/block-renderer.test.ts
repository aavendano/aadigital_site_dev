import { describe, expect, it } from 'vitest';
import { isSupportedBlock } from './block-renderer';

describe('block renderer support', () => {
  it('supports all configured dynamic zone block types', () => {
    expect(isSupportedBlock({ __component: 'shared.rich-text' } as any)).toBe(true);
    expect(isSupportedBlock({ __component: 'shared.media' } as any)).toBe(true);
    expect(isSupportedBlock({ __component: 'shared.quote' } as any)).toBe(true);
    expect(isSupportedBlock({ __component: 'shared.slider' } as any)).toBe(true);
  });

  it('rejects unknown block types', () => {
    expect(isSupportedBlock({ __component: 'shared.unknown' } as any)).toBe(false);
  });
});
