// A lightweight script to fetch and parse BibTeX files

async function loadBibtex(url) {
  try {
    const response = await fetch(url);
    const bibtexData = await response.text();
    return parseBibtex(bibtexData);
  } catch (error) {
    console.error('Error loading BibTeX:', error);
    return [];
  }
}

function parseBibtex(bibtexStr) {
  const entries = [];
  // Split by @ to get individual entries
  const rawEntries = bibtexStr.split('@').filter((str) => str.trim().length > 0);

  rawEntries.forEach((entry) => {
    try {
      // Find the first { which marks the start of the key and content
      const firstBraceIdx = entry.indexOf('{');
      if (firstBraceIdx === -1) return;

      const type = entry.substring(0, firstBraceIdx).trim().toLowerCase();

      // Parse the body
      const body = entry.substring(firstBraceIdx + 1, entry.lastIndexOf('}'));
      const lines = body.split(',');

      const id = lines[0].trim();
      const parsedEntry = { type, id, data: {} };

      // We'll use a regex to match key={value} or key="value" or key=value
      // This is a simple parser and might not handle complex nested braces perfectly,
      // but it's enough for standard BibTeX generated formats.
      const fieldRegex = /([a-zA-Z0-9_]+)\s*=\s*(?:\{([^}]*)\}|"([^"]*)"|([^,\n\r]+))/g;

      let match;
      while ((match = fieldRegex.exec(body)) !== null) {
        const key = match[1].toLowerCase();
        // The value is in capture group 2, 3, or 4 depending on how it was enclosed
        const value = (match[2] || match[3] || match[4] || '').replace(/[\n\r]/g, ' ').trim();
        parsedEntry.data[key] = value;
      }

      entries.push(formatForTemplate(parsedEntry));
    } catch (e) {
      console.warn('Failed to parse an entry:', e);
    }
  });

  return entries;
}

function formatForTemplate(bibEntry) {
  const d = bibEntry.data;

  // Format authors nicely
  let authors = d.author || '';
  authors = authors.replace(/ and /g, ', ');

  // Format the venue/event
  let venue = d.journal || d.booktitle || d.publisher || 'Publication';
  if (d.volume && d.number) {
    venue += `, ${d.volume}(${d.number})`;
  } else if (d.volume) {
    venue += `, ${d.volume}`;
  }
  if (d.pages) {
    venue += `, ${d.pages.replace('--', '-')}`;
  }

  // Set up links
  const links = [];
  if (d.url || d.doi) {
    links.push({
      name: d.doi ? 'DOI' : 'URL',
      url: d.url || `https://doi.org/${d.doi}`,
    });
  }
  if (d.pdf) {
    links.push({ name: 'PDF', url: d.pdf });
  }

  return {
    id: `pub_${bibEntry.id.replace(/[^a-zA-Z0-9]/g, '_')}`,
    title: d.title || 'Untitled Paper',
    role: authors,
    event: venue,
    date: d.year || '',
    description: d.abstract || "Baca selengkapnya melalui tautan yang tersedia.",
    image: d.image || 'images/project_placeholder.png',
    links: links,
  };
}
