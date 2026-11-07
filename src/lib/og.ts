import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { SITE } from '../site.config';

const require = createRequire(import.meta.url);
const fontFile = (weight: 400 | 600) =>
  require.resolve(`@fontsource/literata/files/literata-latin-${weight}-normal.woff`);

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600; style: 'normal' }[]> | undefined;
function loadFonts() {
  fonts ??= Promise.all(
    ([400, 600] as const).map(async (weight) => ({
      name: 'Literata',
      data: await readFile(fontFile(weight)),
      weight,
      style: 'normal' as const,
    })),
  );
  return fonts;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

/** Renders a 1200x630 PNG for link previews (LinkedIn, Slack, etc.). */
export async function renderOgImage({ title, subtitle }: { title: string; subtitle?: string }): Promise<Buffer> {
  const tree = h(
    'div',
    {
      // Satori sizes boxes as content-box: 1024 + 2*88 = 1200, 470 + 2*80 = 630.
      width: 1024,
      height: 470,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '80px 88px',
      background: '#fdfdfc',
      color: '#1c1e21',
      fontFamily: 'Literata',
    },
    [
      h('div', { display: 'flex', flexDirection: 'column', width: 1024, gap: 24 }, [
        h(
          'div',
          {
            display: 'flex',
            width: 1024,
            fontSize: title.length > 60 ? 60 : 72,
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: -1,
          },
          title,
        ),
        subtitle
          ? h('div', { display: 'flex', width: 1024, fontSize: 32, color: '#646a73', lineHeight: 1.4 }, subtitle)
          : null,
      ]),
      h('div', { display: 'flex', width: 1024, justifyContent: 'space-between', fontSize: 28, color: '#646a73' }, [
        h('div', { display: 'flex', color: '#1c1e21', fontWeight: 600 }, SITE.author),
        h('div', { display: 'flex', color: '#2348a8' }, new URL(SITE.url).host),
      ]),
    ],
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: await loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
