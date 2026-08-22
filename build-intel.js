// Regenerates intel/manifest.json from the entry files in intel/.
// Usage: node build-intel.js
// See intel/README.md for the entry file format.

const fs = require('fs');
const path = require('path');

const INTEL_DIR = path.join(__dirname, 'intel');
const MANIFEST_PATH = path.join(INTEL_DIR, 'manifest.json');
const REQUIRED_FIELDS = ['date', 'tag', 'title', 'author'];

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(value) {
    return escapeHtml(value)
        .replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
        .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
        .replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
}

function renderMarkdown(markdown) {
    const blocks = [];
    let paragraph = [];
    let listItems = [];

    function flushParagraph() {
        if (paragraph.length) {
            blocks.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
            paragraph = [];
        }
    }

    function flushList() {
        if (listItems.length) {
            blocks.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
            listItems = [];
        }
    }

    for (const line of markdown.split('\n')) {
        const listMatch = line.match(/^\s*[-*]\s+(.+)$/);
        if (listMatch) {
            flushParagraph();
            listItems.push(listMatch[1]);
        } else if (line.trim()) {
            flushList();
            paragraph.push(line.trim());
        } else {
            flushParagraph();
            flushList();
        }
    }
    flushParagraph();
    flushList();
    return blocks.join('');
}

function parseEntry(raw, filename) {
    const normalized = raw.replace(/\r\n/g, '\n');
    const blankLineIndex = normalized.indexOf('\n\n');
    const headerBlock = blankLineIndex === -1 ? normalized : normalized.slice(0, blankLineIndex);
    const body = blankLineIndex === -1 ? '' : normalized.slice(blankLineIndex + 2).trim();

    const fields = {};
    for (const line of headerBlock.split('\n')) {
        const match = line.match(/^([A-Za-z]+):\s*(.*)$/);
        if (!match) continue;
        fields[match[1].toLowerCase()] = match[2].trim();
    }

    const missing = REQUIRED_FIELDS.filter((f) => !fields[f]);
    if (missing.length > 0) {
        throw new Error(`${filename}: missing required field(s): ${missing.join(', ')}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
        throw new Error(`${filename}: Date must be in YYYY-MM-DD format, got "${fields.date}"`);
    }

    const hashtags = (fields.hashtags || '')
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter(Boolean);

    return {
        date: fields.date,
        tag: fields.tag,
        title: fields.title,
        author: fields.author,
        hashtags,
        description: body,
        descriptionHtml: renderMarkdown(body),
    };
}

function build() {
    const files = fs
        .readdirSync(INTEL_DIR)
        .filter((f) => (f.endsWith('.md') || f.endsWith('.txt')) && f !== 'README.md');

    const entries = files.map((filename) => {
        const raw = fs.readFileSync(path.join(INTEL_DIR, filename), 'utf8');
        return parseEntry(raw, filename);
    });

    entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(entries, null, 2) + '\n');
    console.log(`Wrote ${entries.length} entries to ${path.relative(__dirname, MANIFEST_PATH)}`);
}

build();
