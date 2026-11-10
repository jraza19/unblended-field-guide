import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The 11 condition areas plus 'multiple-conditions' for platforms that span many. Companies can carry several.
export const AREAS = [
  'pcos',
  'endometriosis',
  'menstrual-health',
  'menopause',
  'pregnancy-childbirth',
  'postpartum',
  'infertility',
  'heart-disease',
  'osteoporosis',
  'vaginal-urogenital',
  'sexual-wellness',
  'multiple-conditions',
] as const;

// Description 1: where the support for the approach comes from.
// These describe the kind of evidence. They are not a ranking.
export const EVIDENCE_BASIS = ['new-science', 'established-applied', 'none-public'] as const;

// Description 2: how much of the company's own product has been tested in public.
// Listed in the order products usually move along the path, not in order of merit.
export const PRODUCT_CHECK = [
  'none-public',
  'lab-unpublished',
  'lab-peer-reviewed',
  'pilot',
  'registered-trial',
  'cleared',
] as const;

// How I used a reference. Every claim on a profile carries a numbered reference.
export const REF_USE = [
  'read-in-full',
  'abstract-only',
  'summary-only', // read through a summary of the page, not line by line
  'registry-search', // a search I ran in a public registry, with the date
  'not-read',
  'company-reported',
] as const;

const reference = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  citation: z.string(),
  url: z.string().url(),
  use: z.enum(REF_USE),
  note: z.string().optional(),
});

const startups = defineCollection({
  // Files starting with "_" (like _template.md) are ignored.
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/startups' }),
  schema: z.object({
    // 1. Identity
    name: z.string(),
    summary: z.string().max(240),
    website: z.string().url().optional(),
    country: z.string(),
    foundedYear: z.number().int().optional(),
    areas: z.array(z.enum(AREAS)).min(1),
    type: z.enum(['drug', 'device', 'diagnostic', 'software', 'service', 'platform']),
    // The specific science or technology, in plain words, for the "By technology" view.
    technology: z.string().max(90),
    // "seeking" = looking for funding; "beyond-cap" = labeled contrast example
    fundingStage: z.enum(['grant', 'pre-seed', 'seed', 'series-a', 'beyond-cap', 'seeking', 'unknown']),
    fundingNote: z.string().optional(),
    // Ids of references that support the funding note.
    fundingRefs: z.array(z.string()).default([]),
    // 2. Problem: ids of references (independent sources) for the prevalence figures. At least one.
    prevalenceRefs: z.array(z.string()).min(1),
    // 3. The claim, in one sentence, as the company would put it
    claim: z.string(),
    // 5. Two descriptions of where the company sits (not ratings)
    evidenceBasis: z.enum(EVIDENCE_BASIS),
    productCheck: z.enum(PRODUCT_CHECK),
    howFound: z.string(),
    relationship: z.string().default('None'),
    // Numbered in the order listed. The body cites them as {{ref:id}}.
    references: z.array(reference).min(1),
    lastChecked: z.coerce.date(),
    // Keep true until facts are verified; draft profiles are not shown on the live site.
    draft: z.boolean().default(true),
    // Shown at the top of a published profile that is still being checked.
    reviewNote: z.string().optional(),
  }),
});

const glossary = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/glossary' }),
  schema: z.object({
    term: z.string(),
    // About two sentences, shown in the pop-up.
    short: z.string().max(400),
    // Where the definition comes from. Required.
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
    // false = wording not yet checked against its source; the site says so.
    verified: z.boolean().default(false),
  }),
});

export const collections = { startups, glossary };
