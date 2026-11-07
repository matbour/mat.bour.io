import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './site.config';

const categoryKeys = Object.keys(CATEGORIES) as [keyof typeof CATEGORIES, ...(keyof typeof CATEGORIES)[]];

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(categoryKeys),
    tags: z.array(z.string()).default([]),
    // Language of the post body. The site chrome stays in English.
    lang: z.enum(['en', 'fr']).default('en'),
    // Drafts are visible with `bun run dev` and left out of production builds.
    draft: z.boolean().default(false),
  }),
});

// Where I've worked: one entry per company, newest first (sorted by dates, no manual order).
const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    // What the company does, in one sentence.
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    url: z.url().optional(),
    repo: z.url().optional(),
    // Optional link to a post that tells the story behind the job.
    post: z.string().optional(),
    year: z.number().int(),
    // Last year there, shown as a range ("2020–2022"). Leave out for a single year.
    until: z.union([z.number().int(), z.literal('present')]).optional(),
  }),
});

// Things I build on my own time.
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    url: z.url().optional(),
    repo: z.url().optional(),
    // Optional link to a post that tells the story behind the project.
    post: z.string().optional(),
    year: z.number().int(),
    // Last year of involvement, shown as a range ("2020–2022"). Leave out for a single year.
    until: z.union([z.number().int(), z.literal('present')]).optional(),
    status: z.enum(['active', 'maintained', 'archived']).default('active'),
    order: z.number().default(0),
  }),
});

export const collections = { posts, experience, projects };
