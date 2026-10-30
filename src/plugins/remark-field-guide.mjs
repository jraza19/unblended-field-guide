// Turns two markers in a profile's body into HTML, and fails the build on mistakes.
//   {{term:slug}} or {{term:slug|shown text}}  ->  the word plus an "i" that opens its definition
//   {{ref:id}}                                  ->  a numbered citation, e.g. [3] (also works inside raw HTML blocks)
//   <!-- step: slug | Label -->                 ->  starts a step of the click-through deck
//   <!-- reveal: question --> ... <!-- /reveal --> ->  a guess-first box; the answer shows on click
//   <!-- path: prompt --> ... <!-- /path -->    ->  place-the-company-on-the-path widget; the text inside explains the answer
// The number is the position of the reference in the profile's `references` list.
import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';
import YAML from 'yaml';

const MARKER = /\{\{(term|ref):([a-z0-9-]+)(?:\|([^}]+))?\}\}/g;

function loadGlossary(dir) {
  const terms = new Map();
  if (!fs.existsSync(dir)) return terms;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md') || file.startsWith('_')) continue;
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;
    const data = YAML.parse(match[1]);
    terms.set(file.replace(/\.md$/, ''), data);
  }
  return terms;
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default function remarkFieldGuide({ base = '', glossaryDir, stagesFile }) {
  return (tree, file) => {
    const fm = file.data?.astro?.frontmatter;
    // Only profiles carry references; other markdown files pass through.
    if (!fm || !Array.isArray(fm.references)) return;
    const where = file.path ?? 'a profile';
    const glossary = loadGlossary(glossaryDir);
    const refIndex = new Map(fm.references.map((r, i) => [r.id, i + 1]));
    const cited = new Set();

    for (const id of fm.fundingRefs ?? []) {
      if (!refIndex.has(id)) throw new Error(`${where}: fundingRefs names "${id}", which is not in references.`);
      cited.add(id);
    }

    for (const id of fm.prevalenceRefs ?? []) {
      if (!refIndex.has(id)) throw new Error(`${where}: prevalenceRefs names "${id}", which is not in references.`);
      cited.add(id);
    }

    // Structure markers: steps, reveal-the-answer boxes, and the place-it-on-the-path widget.
    const STEP = /^<!--\s*step:\s*([a-z0-9-]+)\s*\|\s*(.+?)\s*-->$/;
    const REVEAL = /^<!--\s*reveal:\s*(.+?)\s*-->$/;
    const PATH = /^<!--\s*path:\s*(.+?)\s*-->$/;
    const html = (value) => ({ type: 'html', value });
    const stages = JSON.parse(fs.readFileSync(stagesFile, 'utf8'));
    const answer = stages.find((s) => s.id === fm.productCheck);
    if (!answer) throw new Error(`${where}: productCheck "${fm.productCheck}" is not a known stage.`);
    const grouped = [];
    let inStep = false;
    for (const node of tree.children) {
      const v = node.type === 'html' ? node.value.trim() : '';
      let m;
      if ((m = v.match(STEP))) {
        if (inStep) grouped.push(html('</section>'));
        grouped.push(html(`<section class="step" id="step-${m[1]}" data-step="${m[1]}" data-label="${esc(m[2])}">`));
        inStep = true;
      } else if ((m = v.match(REVEAL))) {
        grouped.push(html(
          `<div class="reveal"><p class="reveal-q">${esc(m[1])}</p>` +
          `<button type="button" class="btn reveal-btn">Show the answer</button><div class="reveal-a" hidden>`));
      } else if (v === '<!-- /reveal -->') {
        grouped.push(html('</div></div>'));
      } else if ((m = v.match(PATH))) {
        const buttons = stages
          .map((s) => `<li><button type="button" class="stage" data-stage="${s.id}">${esc(s.label)}</button></li>`)
          .join('');
        grouped.push(html(
          `<div class="path-widget" data-answer="${answer.id}" data-answer-label="${esc(answer.label)}">` +
          `<p class="reveal-q">${esc(m[1])}</p><ol class="stages">${buttons}</ol>` +
          `<div class="path-feedback" hidden><p class="path-lead"></p>`));
      } else if (v === '<!-- /path -->') {
        grouped.push(html('</div></div>'));
      } else {
        grouped.push(node);
      }
    }
    if (inStep) grouped.push(html('</section>'));
    tree.children = grouped;

    // One place that turns a marker into HTML, so plain text and raw HTML blocks behave the same.
    const renderMarker = (kind, key, shown) => {
      if (kind === 'ref') {
        if (!refIndex.has(key)) throw new Error(`${where}: cites {{ref:${key}}}, which is not in references.`);
        cited.add(key);
        const n = refIndex.get(key);
        return `<sup class="ref"><a href="#ref-${n}" aria-label="Reference ${n}">[${n}]</a></sup>`;
      }
      const entry = glossary.get(key);
      if (!entry) throw new Error(`${where}: uses {{term:${key}}}, but no glossary file ${key}.md exists.`);
      const text = shown ?? entry.term;
      const flag = entry.verified ? '' : ' <em>(Definition not yet checked against its source.)</em>';
      return (
        `<span class="term">${esc(text)}` +
        `<a class="term-i" href="${base}/glossary/#${key}" aria-expanded="false" aria-label="What does “${esc(entry.term)}” mean?">i</a>` +
        `<span class="term-def" hidden><strong>${esc(entry.term)}.</strong> ${esc(entry.short)}${flag} ` +
        `<a href="${base}/glossary/#${key}">Glossary entry</a></span></span>`
      );
    };

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || !MARKER.test(node.value)) return;
      MARKER.lastIndex = 0;
      const out = [];
      let last = 0;
      for (const m of node.value.matchAll(MARKER)) {
        const [whole, kind, key, shown] = m;
        if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) });
        out.push({ type: 'html', value: renderMarker(kind, key, shown) });
        last = m.index + whole.length;
      }
      if (last < node.value.length) out.push({ type: 'text', value: node.value.slice(last) });
      parent.children.splice(index, 1, ...out);
      return index + out.length;
    });

    // Raw HTML blocks in a profile (such as an animated scene) may carry the same markers.
    visit(tree, 'html', (node) => {
      if (!node.value.includes('{{')) return;
      node.value = node.value.replace(MARKER, (_whole, kind, key, shown) => renderMarker(kind, key, shown));
    });

    const unused = fm.references.filter((r) => !cited.has(r.id)).map((r) => r.id);
    if (unused.length) throw new Error(`${where}: references never cited in the text: ${unused.join(', ')}.`);
  };
}
