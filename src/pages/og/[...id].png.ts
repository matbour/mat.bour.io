import type { APIContext } from 'astro';
import { getPosts, type Post } from '../../lib/posts';
import { renderOgImage } from '../../lib/og';
import { SITE } from '../../site.config';

export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    { params: { id: 'default' }, props: { post: undefined } },
    ...posts.map((post) => ({ params: { id: post.id }, props: { post } })),
  ];
}

export async function GET({ props }: APIContext<{ post?: Post }>) {
  const { post } = props;
  const png = await renderOgImage(
    post
      ? { title: post.data.title, subtitle: post.data.description }
      : { title: SITE.title, subtitle: SITE.description },
  );
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
