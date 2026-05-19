import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Copy, FileText, Printer, ChevronLeft, ChevronRight, Check, FileX, FilePlus } from 'lucide-react';

/* ============================================================
   CareerCopilot Document Builder
   Pure client-side. No storage. No API calls.
   Deterministic local pipelines only. Never invents facts.
   ============================================================ */

/* ---------- Constants ---------- */

const STEPS = ['Source Material', 'Job Target', 'Preferences & Generate'];

const TEMPLATES = {
  'ats-classic': {
    label: 'ATS Classic',
    fontStack: '"Times New Roman", Georgia, serif',
    headingTransform: 'uppercase',
    headingSize: '11px',
    headingWeight: 700,
    headingSpacing: '0.12em',
    headingRule: 'solid',
    sectionGap: 14,
    lineHeight: 1.3,
    nameSize: '22px',
    headlineSize: '13px',
    headlineStyle: 'italic',
    bulletChar: '•',
    smallCaps: false,
  },
  'community-warm': {
    label: 'Community Warm',
    fontStack: 'Georgia, "Times New Roman", serif',
    headingTransform: 'none',
    headingSize: '13px',
    headingWeight: 600,
    headingSpacing: '0.02em',
    headingRule: 'hairline',
    sectionGap: 20,
    lineHeight: 1.3,
    nameSize: '28px',
    headlineSize: '14px',
    headlineStyle: 'italic',
    bulletChar: '•',
    smallCaps: false,
  },
  'modern-clean': {
    label: 'Modern Clean',
    fontStack: 'Arial, Helvetica, Calibri, sans-serif',
    headingTransform: 'uppercase',
    headingSize: '10px',
    headingWeight: 600,
    headingSpacing: '0.18em',
    headingRule: 'none',
    sectionGap: 18,
    lineHeight: 1.25,
    nameSize: '24px',
    headlineSize: '12px',
    headlineStyle: 'normal',
    bulletChar: '–',
    smallCaps: true,
  },
  'compact-one-page': {
    label: 'Compact One-Page',
    fontStack: 'Tahoma, Verdana, Arial, sans-serif',
    headingTransform: 'none',
    headingSize: '11px',
    headingWeight: 700,
    headingSpacing: '0.04em',
    headingRule: 'none',
    sectionGap: 10,
    lineHeight: 1.12,
    nameSize: '18px',
    headlineSize: '11px',
    headlineStyle: 'normal',
    bulletChar: '–',
    smallCaps: false,
  },
};

const TONES = {
  professional: 'Professional',
  warm: 'Warm',
  formal: 'Formal',
  direct: 'Direct',
};

/* ---------- Structured doc contract ----------
 * Canonical shapes for ResumeDoc and CoverLetterDoc.
 * All generation paths (blank, parse, tailor) flow through these factories
 * so the contract is defined exactly once.
 */

function createResumeDoc(partial = {}) {
  return {
    name: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    ...partial,
  };
}

function createCoverLetterDoc(partial = {}) {
  return {
    date: '',
    recipientName: '',
    recipientTitle: '',
    company: '',
    salutation: '',
    paragraphs: [],
    closing: '',
    signature: '',
    ...partial,
  };
}

/* ---------- Blank scaffolds (exact approved tokens, no coaching prose) ---------- */

const blankResume = () => createResumeDoc({
  name: '[Name]',
  email: '[Email]',
  phone: '[Phone]',
  location: '[Location]',
  headline: '[Headline]',
  summary: '[Summary]',
  experience: [
    {
      title: '[Job title]',
      employer: '[Employer]',
      location: '[City, State]',
      start: '[Start]',
      end: '[End]',
      bullets: ['[Bullet]', '[Bullet]', '[Bullet]'],
    },
    {
      title: '[Job title]',
      employer: '[Employer]',
      location: '[City, State]',
      start: '[Start]',
      end: '[End]',
      bullets: ['[Bullet]', '[Bullet]', '[Bullet]'],
    },
  ],
  education: [
    { degree: '[Degree]', institution: '[Institution]', date: '[Date]' },
  ],
  skills: ['[Skill]', '[Skill]', '[Skill]', '[Skill]', '[Skill]', '[Skill]'],
  certifications: [],
});

const blankCover = () => createCoverLetterDoc({
  date: '[Date]',
  recipientName: '[Recipient name]',
  recipientTitle: '[Recipient title]',
  company: '[Company]',
  salutation: '[Salutation]',
  paragraphs: ['[Paragraph]', '[Paragraph]', '[Paragraph]'],
  closing: '[Closing]',
  signature: '[Signature]',
});

/* ---------- Stopwords for keyword extraction ---------- */

const STOPWORDS = new Set([
  'a','an','the','and','or','but','of','in','on','at','to','for','with','by','from','as','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','must','can','i','you','he','she','it','we','they','them','their','our','my','your','his','her','its','this','that','these','those','what','which','who','whom','when','where','why','how','all','each','every','some','any','no','not','only','own','same','so','than','too','very','just','also','about','into','out','up','down','over','under','again','further','then','once','here','there','both','few','more','most','other','such','via','per','using','use','used','include','includes','including','etc','also'
]);

/* ---------- Pure helpers: tokenize / keywords / scoring ---------- */

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

function bigrams(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    out.push(tokens[i] + ' ' + tokens[i + 1]);
  }
  return out;
}

function extractKeywords({ jobTitle, positionDesc, rolesResp, ksc, userNotes }) {
  const sources = [
    { text: ksc, weight: 3.0 },
    { text: jobTitle, weight: 3.0 },
    { text: rolesResp, weight: 2.5 },
    { text: positionDesc, weight: 2.0 },
    { text: userNotes, weight: 1.0 },
  ];
  const map = new Map();
  for (const { text, weight } of sources) {
    const toks = tokenize(text || '');
    for (const t of toks) {
      map.set(t, (map.get(t) || 0) + weight);
    }
    for (const bg of bigrams(toks)) {
      map.set(bg, (map.get(bg) || 0) + weight * 1.5);
    }
  }
  return map;
}

function scoreText(text, keywordMap) {
  if (!text || keywordMap.size === 0) return 0;
  const toks = tokenize(text);
  const bgs = bigrams(toks);
  let score = 0;
  for (const t of toks) if (keywordMap.has(t)) score += keywordMap.get(t);
  for (const bg of bgs) if (keywordMap.has(bg)) score += keywordMap.get(bg);
  return score;
}

/* ---------- Resume parser (heuristic, deterministic) ---------- */

const SECTION_PATTERNS = {
  summary: /^(summary|profile|professional summary|career profile|objective|about(?:\s+me)?)\s*:?\s*$/i,
  experience: /^(experience|work experience|employment|employment history|professional experience|work history|career history)\s*:?\s*$/i,
  education: /^(education|academic background|qualifications|academic qualifications)\s*:?\s*$/i,
  skills: /^(skills|technical skills|core competencies|key skills|competencies|expertise)\s*:?\s*$/i,
  certifications: /^(certifications?|licen[cs]es?|accreditations?)\s*:?\s*$/i,
};

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
const PHONE_RE = /(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}([\s.-]?\d{1,4})?/;
const DATE_RANGE_RE = /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})\s*[-–—to]+\s*(?:present|current|now|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4})/i;

function detectSection(line) {
  const trimmed = line.trim();
  for (const [key, re] of Object.entries(SECTION_PATTERNS)) {
    if (re.test(trimmed)) return key;
  }
  return null;
}

function parseContact(lines) {
  const contact = { name: '', email: '', phone: '', location: '' };
  // First non-empty non-section line that isn't email/phone is treated as name
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (detectSection(t)) break;
    if (EMAIL_RE.test(t) && !contact.email) {
      contact.email = (t.match(EMAIL_RE) || [''])[0];
    }
    if (PHONE_RE.test(t) && !contact.phone && !EMAIL_RE.test(t)) {
      const m = t.match(PHONE_RE);
      if (m && m[0].replace(/\D/g, '').length >= 8) contact.phone = m[0].trim();
    }
    // Location heuristic: short line with comma, no @, no digits-only run
    if (!contact.location && /,/.test(t) && !EMAIL_RE.test(t) && t.length < 60 && !/\d{4,}/.test(t)) {
      contact.location = t;
    }
    if (!contact.name && !EMAIL_RE.test(t) && !PHONE_RE.test(t) && t.length < 80 && /^[A-Z]/.test(t)) {
      contact.name = t.replace(/\s{2,}/g, ' ');
    }
  }
  return contact;
}

function parseExperienceEntries(block) {
  // Split into entries by lines containing a date range
  const lines = block.split('\n');
  const entries = [];
  let current = null;

  const pushBullet = (text) => {
    if (!current) return;
    const cleaned = text.replace(/^[\s•\-–—*▪]+/, '').trim();
    if (cleaned) current.bullets.push(cleaned);
  };

  const finalizeCurrent = () => {
    if (current && (current.title || current.employer || current.bullets.length)) {
      entries.push(current);
    }
    current = null;
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    const hasDate = DATE_RANGE_RE.test(trimmed);
    const isBullet = /^[\s]*[•\-–—*▪]/.test(line);

    if (hasDate && !isBullet) {
      // New entry header detected
      finalizeCurrent();
      current = { title: '', employer: '', location: '', start: '', end: '', bullets: [] };

      // Try parse: "Title | Employer | Dates" or "Title at Employer (Dates)" or multi-line
      const dateMatch = trimmed.match(DATE_RANGE_RE);
      const dateStr = dateMatch ? dateMatch[0] : '';
      const beforeDate = trimmed.replace(DATE_RANGE_RE, '').replace(/[|()]/g, '|').split('|').map(s => s.trim()).filter(Boolean);

      if (beforeDate.length >= 2) {
        current.title = beforeDate[0];
        current.employer = beforeDate[1];
        if (beforeDate[2]) current.location = beforeDate[2];
      } else if (beforeDate.length === 1) {
        current.title = beforeDate[0];
        // Look at next line for employer
        const next = (lines[i + 1] || '').trim();
        if (next && !DATE_RANGE_RE.test(next) && !isBulletStart(next) && !detectSection(next)) {
          current.employer = next;
          i++;
        }
      }
      const dateParts = dateStr.split(/\s*[-–—to]+\s*/i);
      current.start = (dateParts[0] || '').trim();
      current.end = (dateParts[1] || '').trim();
    } else if (current && isBullet) {
      pushBullet(trimmed);
    } else if (current && !hasDate && current.bullets.length === 0 && !current.employer && !isBullet) {
      // Could be employer line just below title
      if (!current.employer) current.employer = trimmed;
    } else if (current && !isBullet) {
      // Treat as bullet/paragraph
      pushBullet(trimmed);
    }
    i++;
  }
  finalizeCurrent();
  return entries;
}

function isBulletStart(line) {
  return /^[\s]*[•\-–—*▪]/.test(line);
}

function parseEducationEntries(block) {
  const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
  const entries = [];
  for (const line of lines) {
    if (isBulletStart(line)) continue;
    const dateMatch = line.match(DATE_RANGE_RE) || line.match(/\b(19|20)\d{2}\b/);
    const date = dateMatch ? dateMatch[0] : '';
    const rest = line.replace(date, '').replace(/[|()]/g, '|').split('|').map(s => s.trim()).filter(Boolean);
    entries.push({
      degree: rest[0] || '',
      institution: rest[1] || '',
      date: date,
    });
  }
  return entries.length ? entries : [];
}

function parseSkillsBlock(block) {
  // Skills can be comma-separated, bullet-separated, or newline-separated
  const cleaned = block
    .split(/\n/)
    .map(l => l.replace(/^[\s•\-–—*▪]+/, '').trim())
    .filter(Boolean);
  const joined = cleaned.join(', ');
  const items = joined
    .split(/[,;|·]/)
    .map(s => s.trim())
    .filter(s => s && s.length < 60);
  return items;
}

function parseResume(text) {
  if (!text || !text.trim()) return null;
  const lines = text.split('\n');
  const sections = { header: [], summary: [], experience: [], education: [], skills: [], certifications: [] };
  let current = 'header';
  for (const line of lines) {
    const section = detectSection(line);
    if (section) {
      current = section;
      continue;
    }
    sections[current].push(line);
  }

  const contact = parseContact(sections.header);

  // Headline: if header has a short tagline after the name line
  let headline = '';
  for (const line of sections.header) {
    const t = line.trim();
    if (!t || t === contact.name || EMAIL_RE.test(t) || PHONE_RE.test(t) || t === contact.location) continue;
    if (t.length > 0 && t.length < 120) {
      headline = t;
      break;
    }
  }

  const summary = sections.summary.join('\n').trim();
  const experience = parseExperienceEntries(sections.experience.join('\n'));
  const education = parseEducationEntries(sections.education.join('\n'));
  const skills = parseSkillsBlock(sections.skills.join('\n'));
  const certifications = parseSkillsBlock(sections.certifications.join('\n'));

  return createResumeDoc({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    location: contact.location,
    headline,
    summary,
    experience,
    education,
    skills,
    certifications,
  });
}

/* ---------- Cover letter parser ---------- */

function parseCoverLetter(text) {
  if (!text || !text.trim()) return null;
  const lines = text.split('\n');
  let date = '', recipientName = '', recipientTitle = '', company = '', salutation = '', closing = '', signature = '';
  const paragraphs = [];

  // Heuristic: first line resembling a date
  const dateLineIdx = lines.findIndex(l =>
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}/i.test(l) ||
    /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/i.test(l) ||
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(l)
  );
  if (dateLineIdx >= 0) date = lines[dateLineIdx].trim();

  // Salutation
  const salIdx = lines.findIndex(l => /^\s*(dear|to whom)/i.test(l));
  if (salIdx >= 0) salutation = lines[salIdx].trim().replace(/[,:]\s*$/, '');

  // Closing
  const closeIdx = lines.findIndex(l => /^\s*(yours sincerely|sincerely|kind regards|best regards|regards|yours faithfully|warm regards)/i.test(l));
  if (closeIdx >= 0) closing = lines[closeIdx].trim().replace(/[,]\s*$/, '');

  // Signature: line after closing
  if (closeIdx >= 0 && closeIdx + 1 < lines.length) {
    for (let i = closeIdx + 1; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t) { signature = t; break; }
    }
  }

  // Body paragraphs: between salutation and closing
  const bodyStart = salIdx >= 0 ? salIdx + 1 : 0;
  const bodyEnd = closeIdx >= 0 ? closeIdx : lines.length;
  const bodyLines = lines.slice(bodyStart, bodyEnd);
  let buffer = [];
  for (const line of bodyLines) {
    if (line.trim() === '') {
      if (buffer.length) {
        paragraphs.push(buffer.join(' ').trim());
        buffer = [];
      }
    } else {
      buffer.push(line.trim());
    }
  }
  if (buffer.length) paragraphs.push(buffer.join(' ').trim());

  // Recipient: lines between date and salutation
  if (salIdx > 0) {
    const headerLines = lines.slice(dateLineIdx + 1 >= 0 ? dateLineIdx + 1 : 0, salIdx)
      .map(l => l.trim())
      .filter(Boolean);
    if (headerLines[0]) recipientName = headerLines[0];
    if (headerLines[1]) recipientTitle = headerLines[1];
    if (headerLines[2]) company = headerLines[2];
  }

  return createCoverLetterDoc({ date, recipientName, recipientTitle, company, salutation, paragraphs, closing, signature });
}

/* ---------- Tailoring (real deterministic transformations) ---------- */

function tailorResume(parsed, keywordMap) {
  if (!parsed) return null;
  const src = createResumeDoc(parsed);

  // Reorder bullets within each role by score (descending), preserve reverse chronology of roles
  const experience = src.experience.map(entry => {
    const scored = entry.bullets.map(b => ({ text: b, score: scoreText(b, keywordMap) }));
    scored.sort((a, b) => b.score - a.score);
    return { ...entry, bullets: scored.map(s => s.text) };
  });

  // Reorder skills by score
  const scoredSkills = src.skills.map(s => ({ text: s, score: scoreText(s, keywordMap) }));
  scoredSkills.sort((a, b) => b.score - a.score);
  const skills = scoredSkills.map(s => s.text);

  return createResumeDoc({ ...src, experience, skills });
}

function tailorCoverLetter(parsed, jobTitle, employer, tone, keywordMap) {
  // Per spec: never invent prose. If no source, use blank scaffold.
  if (!parsed || parsed.paragraphs.length === 0) {
    const blank = blankCover();
    if (employer && employer.trim()) blank.company = employer.trim();
    return blank;
  }
  const src = createCoverLetterDoc(parsed);
  let paragraphs = [...src.paragraphs];

  // Score and reorder middle paragraphs by relevance; preserve opener and closer
  if (paragraphs.length > 2) {
    const opener = paragraphs[0];
    const closer = paragraphs[paragraphs.length - 1];
    const middle = paragraphs.slice(1, -1);
    const scoredMiddle = middle.map(p => ({ text: p, score: scoreText(p, keywordMap) }));
    scoredMiddle.sort((a, b) => b.score - a.score);
    paragraphs = [opener, ...scoredMiddle.map(s => s.text), closer];
  }

  // Substitute employer if user supplied a real value and source company was unset/placeholder
  const company = (employer && employer.trim() && (!src.company || src.company === '[Company]'))
    ? employer.trim()
    : src.company;

  return createCoverLetterDoc({ ...src, paragraphs, company });
}

/* ---------- Export functions ---------- */

function resumeToText(r) {
  const lines = [];
  if (r.name) lines.push(r.name);
  if (r.headline) lines.push(r.headline);
  const contactBits = [r.phone, r.email, r.location].filter(Boolean);
  if (contactBits.length) lines.push(contactBits.join(' | '));
  if (r.summary) { lines.push('', 'PROFESSIONAL SUMMARY', r.summary); }
  if (r.experience?.length) {
    lines.push('', 'WORK EXPERIENCE');
    for (const e of r.experience) {
      lines.push('');
      const head = [e.title, e.employer, e.location].filter(Boolean).join(' | ');
      const dates = [e.start, e.end].filter(Boolean).join(' – ');
      lines.push(head + (dates ? '  ' + dates : ''));
      for (const b of e.bullets) lines.push('• ' + b);
    }
  }
  if (r.education?.length) {
    lines.push('', 'EDUCATION');
    for (const ed of r.education) {
      lines.push([ed.degree, ed.institution, ed.date].filter(Boolean).join(' | '));
    }
  }
  if (r.skills?.length) {
    lines.push('', 'SKILLS', r.skills.join(' · '));
  }
  if (r.certifications?.length) {
    lines.push('', 'CERTIFICATIONS');
    for (const c of r.certifications) lines.push('• ' + c);
  }
  return lines.join('\n');
}

function resumeToMarkdown(r) {
  const out = [];
  if (r.name) out.push(`# ${r.name}`);
  if (r.headline) out.push(`*${r.headline}*`);
  const contactBits = [r.phone, r.email, r.location].filter(Boolean);
  if (contactBits.length) out.push(contactBits.join(' | '));
  if (r.summary) { out.push('', '## Professional Summary', '', r.summary); }
  if (r.experience?.length) {
    out.push('', '## Work Experience');
    for (const e of r.experience) {
      out.push('');
      const head = `**${e.title}** — ${e.employer}`;
      const meta = [e.location, [e.start, e.end].filter(Boolean).join(' – ')].filter(Boolean).join(' · ');
      out.push(head);
      if (meta) out.push(`*${meta}*`);
      out.push('');
      for (const b of e.bullets) out.push(`- ${b}`);
    }
  }
  if (r.education?.length) {
    out.push('', '## Education', '');
    for (const ed of r.education) {
      const parts = [`**${ed.degree}**`, ed.institution, ed.date].filter(Boolean);
      out.push(parts.join(' — '));
    }
  }
  if (r.skills?.length) {
    out.push('', '## Skills', '', r.skills.map(s => `\`${s}\``).join(' · '));
  }
  if (r.certifications?.length) {
    out.push('', '## Certifications', '');
    for (const c of r.certifications) out.push(`- ${c}`);
  }
  return out.join('\n');
}

function coverToText(c) {
  const lines = [];
  if (c.date) lines.push(c.date);
  lines.push('');
  if (c.recipientName) lines.push(c.recipientName);
  if (c.recipientTitle) lines.push(c.recipientTitle);
  if (c.company) lines.push(c.company);
  lines.push('');
  if (c.salutation) lines.push(c.salutation + ',');
  lines.push('');
  for (const p of c.paragraphs) { lines.push(p); lines.push(''); }
  if (c.closing) lines.push(c.closing + ',');
  lines.push('');
  if (c.signature) lines.push(c.signature);
  return lines.join('\n');
}

function coverToMarkdown(c) {
  return coverToText(c);
}

/* ---------- React components ---------- */

function EditableSpan({ value, onCommit, multiline = false, style, placeholder, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerText !== (value || '')) {
      ref.current.innerText = value || '';
    }
  }, [value]);
  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      className={className}
      style={style}
      onBlur={(e) => onCommit(e.currentTarget.innerText)}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

function SectionHeading({ template, children }) {
  const t = template;
  const style = {
    fontFamily: t.fontStack,
    fontSize: t.headingSize,
    fontWeight: t.headingWeight,
    letterSpacing: t.headingSpacing,
    textTransform: t.headingTransform,
    fontVariant: t.smallCaps ? 'small-caps' : 'normal',
    margin: '0 0 6px 0',
    color: '#111',
    borderBottom:
      t.headingRule === 'solid' ? '1.5px solid #111' :
      t.headingRule === 'hairline' ? '0.5px solid #bbb' : 'none',
    paddingBottom: t.headingRule !== 'none' ? '3px' : '0',
  };
  return <div style={style}>{children}</div>;
}

function ResumeDocument({ data, setData, template }) {
  const t = template;
  const docStyle = {
    fontFamily: t.fontStack,
    fontSize: '13px',
    lineHeight: t.lineHeight,
    color: '#111',
    padding: '36px 40px',
    background: 'white',
    minHeight: '900px',
  };

  const updateField = (key) => (v) => setData(d => ({ ...d, [key]: v }));
  const updateExp = (i, key, v) => setData(d => {
    const exp = [...d.experience];
    exp[i] = { ...exp[i], [key]: v };
    return { ...d, experience: exp };
  });
  const updateBullet = (i, j, v) => setData(d => {
    const exp = [...d.experience];
    const bullets = [...exp[i].bullets];
    bullets[j] = v;
    exp[i] = { ...exp[i], bullets };
    return { ...d, experience: exp };
  });
  const updateEdu = (i, key, v) => setData(d => {
    const ed = [...d.education];
    ed[i] = { ...ed[i], [key]: v };
    return { ...d, education: ed };
  });
  const updateSkill = (i, v) => setData(d => {
    const s = [...d.skills];
    s[i] = v;
    return { ...d, skills: s };
  });
  const updateCert = (i, v) => setData(d => {
    const c = [...d.certifications];
    c[i] = v;
    return { ...d, certifications: c };
  });

  return (
    <div style={docStyle} className="doc-resume-paper">
      {/* Header */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: t.nameSize, fontWeight: 700, color: '#111', marginBottom: '4px', fontFamily: t.fontStack }}>
          <EditableSpan value={data.name} onCommit={updateField('name')} />
        </div>
        {data.headline ? (
          <div style={{ fontSize: t.headlineSize, fontStyle: t.headlineStyle, color: '#333', marginBottom: '6px', fontFamily: t.fontStack }}>
            <EditableSpan value={data.headline} onCommit={updateField('headline')} />
          </div>
        ) : null}
        <div style={{ fontSize: '11px', color: '#555' }}>
          <EditableSpan value={data.phone} onCommit={updateField('phone')} />
          {' | '}
          <EditableSpan value={data.email} onCommit={updateField('email')} />
          {' | '}
          <EditableSpan value={data.location} onCommit={updateField('location')} />
        </div>
      </div>

      {data.summary ? (
        <div style={{ marginBottom: `${t.sectionGap}px` }}>
          <SectionHeading template={t}>Professional Summary</SectionHeading>
          <p style={{ marginTop: '6px', lineHeight: t.lineHeight }}>
            <EditableSpan value={data.summary} onCommit={updateField('summary')} multiline />
          </p>
        </div>
      ) : null}

      {data.experience?.length ? (
        <div style={{ marginBottom: `${t.sectionGap}px` }}>
          <SectionHeading template={t}>Work Experience</SectionHeading>
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginTop: i === 0 ? '8px' : '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                  <EditableSpan value={e.title} onCommit={(v) => updateExp(i, 'title', v)} />
                </span>
                <span style={{ fontSize: '11px', color: '#666' }}>
                  <EditableSpan value={e.start} onCommit={(v) => updateExp(i, 'start', v)} />
                  {' – '}
                  <EditableSpan value={e.end} onCommit={(v) => updateExp(i, 'end', v)} />
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '5px' }}>
                <EditableSpan value={e.employer} onCommit={(v) => updateExp(i, 'employer', v)} />
                {e.location ? <> {' · '} <EditableSpan value={e.location} onCommit={(v) => updateExp(i, 'location', v)} /></> : null}
              </div>
              {e.bullets.map((b, j) => (
                <div key={j} style={{ display: 'flex', gap: '8px', lineHeight: t.lineHeight, marginBottom: '3px' }}>
                  <span style={{ flexShrink: 0, marginTop: '1px' }}>{t.bulletChar}</span>
                  <span style={{ flex: 1 }}>
                    <EditableSpan value={b} onCommit={(v) => updateBullet(i, j, v)} multiline />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {data.education?.length ? (
        <div style={{ marginBottom: `${t.sectionGap}px` }}>
          <SectionHeading template={t}>Education</SectionHeading>
          {data.education.map((ed, i) => (
            <div key={i} style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600 }}>
                  <EditableSpan value={ed.degree} onCommit={(v) => updateEdu(i, 'degree', v)} />
                </span>
                <span style={{ fontSize: '11px', color: '#666' }}>
                  <EditableSpan value={ed.date} onCommit={(v) => updateEdu(i, 'date', v)} />
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#555' }}>
                <EditableSpan value={ed.institution} onCommit={(v) => updateEdu(i, 'institution', v)} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {data.skills?.length ? (
        <div style={{ marginBottom: `${t.sectionGap}px` }}>
          <SectionHeading template={t}>Skills</SectionHeading>
          <div style={{ marginTop: '8px', lineHeight: 1.6, fontSize: '12px' }}>
            {data.skills.map((s, i) => (
              <React.Fragment key={i}>
                <EditableSpan value={s} onCommit={(v) => updateSkill(i, v)} />
                {i < data.skills.length - 1 ? ' · ' : ''}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : null}

      {data.certifications?.length ? (
        <div style={{ marginBottom: `${t.sectionGap}px` }}>
          <SectionHeading template={t}>Certifications</SectionHeading>
          {data.certifications.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <span style={{ flexShrink: 0 }}>{t.bulletChar}</span>
              <span style={{ flex: 1 }}>
                <EditableSpan value={c} onCommit={(v) => updateCert(i, v)} />
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CoverLetterDocument({ data, setData, template }) {
  const t = template;
  const docStyle = {
    fontFamily: t.fontStack,
    fontSize: '13px',
    lineHeight: t.lineHeight,
    color: '#111',
    padding: '40px 44px',
    background: 'white',
    minHeight: '900px',
  };
  const update = (key) => (v) => setData(d => ({ ...d, [key]: v }));
  const updatePara = (i, v) => setData(d => {
    const p = [...d.paragraphs];
    p[i] = v;
    return { ...d, paragraphs: p };
  });

  return (
    <div style={docStyle} className="doc-cover-paper">
      <div style={{ fontSize: '12px', color: '#555', marginBottom: '20px' }}>
        <EditableSpan value={data.date} onCommit={update('date')} />
      </div>
      <div style={{ fontSize: '13px', marginBottom: '18px', lineHeight: 1.6 }}>
        <div><EditableSpan value={data.recipientName} onCommit={update('recipientName')} /></div>
        <div><EditableSpan value={data.recipientTitle} onCommit={update('recipientTitle')} /></div>
        <div><EditableSpan value={data.company} onCommit={update('company')} /></div>
      </div>
      <div style={{ fontSize: '13px', marginBottom: '14px' }}>
        <EditableSpan value={data.salutation} onCommit={update('salutation')} />
        {','}
      </div>
      {data.paragraphs.map((p, i) => (
        <p key={i} style={{ lineHeight: t.lineHeight, marginBottom: '14px', fontSize: '13px' }}>
          <EditableSpan value={p} onCommit={(v) => updatePara(i, v)} multiline />
        </p>
      ))}
      <div style={{ fontSize: '13px', marginTop: '20px' }}>
        <div><EditableSpan value={data.closing} onCommit={update('closing')} />,</div>
        <div style={{ marginTop: '36px' }}><EditableSpan value={data.signature} onCommit={update('signature')} /></div>
      </div>
    </div>
  );
}

/* ---------- Main app ---------- */

export default function CareerCopilotDocumentBuilder() {
  const [step, setStep] = useState(0);
  const [sourceResume, setSourceResume] = useState('');
  const [sourceCoverLetter, setSourceCoverLetter] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [employer, setEmployer] = useState('');
  const [positionDesc, setPositionDesc] = useState('');
  const [rolesResp, setRolesResp] = useState('');
  const [ksc, setKsc] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [templateKey, setTemplateKey] = useState('community-warm');
  const [tone, setTone] = useState('professional');

  const [resumeData, setResumeData] = useState(null);
  const [coverData, setCoverData] = useState(null);
  const [activeTab, setActiveTab] = useState('resume');
  const [notif, setNotif] = useState(null);

  /* Refs that mirror state for synchronous reads.
   * Why: React setState is async. After a contentEditable blur fires and calls
   * setData, a follow-up Print/Copy click in the same tick would otherwise read
   * the pre-blur closure-captured state. The ref is written synchronously inside
   * commit{Resume,Cover}, so exports always see the latest edit. */
  const resumeDataRef = useRef(null);
  const coverDataRef = useRef(null);
  useEffect(() => { resumeDataRef.current = resumeData; }, [resumeData]);
  useEffect(() => { coverDataRef.current = coverData; }, [coverData]);

  /* commitResume / commitCover: write to ref synchronously, then schedule state update.
   * These are the ONLY paths that mutate document state. They are fully isolated:
   * commitResume never touches cover state and vice versa. */
  const commitResume = (updater) => {
    const next = typeof updater === 'function' ? updater(resumeDataRef.current) : updater;
    resumeDataRef.current = next;
    setResumeData(next);
  };
  const commitCover = (updater) => {
    const next = typeof updater === 'function' ? updater(coverDataRef.current) : updater;
    coverDataRef.current = next;
    setCoverData(next);
  };

  const template = TEMPLATES[templateKey];
  /* Template-switch purity: setTemplateKey is the only state touched on template change.
   * resumeData and coverData are never mutated when switching templates — documents
   * simply re-render with new styling via the `template` prop. */

  const keywordMap = useMemo(
    () => extractKeywords({ jobTitle, positionDesc, rolesResp, ksc, userNotes }),
    [jobTitle, positionDesc, rolesResp, ksc, userNotes]
  );

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 1800);
  };

  /* Actions */

  const generateResume = () => {
    const parsed = parseResume(sourceResume);
    if (!parsed) {
      showNotif('No source resume to parse. Use Blank Resume Template instead.');
      return;
    }
    const tailored = tailorResume(parsed, keywordMap);
    commitResume(tailored);
    setActiveTab('resume');
  };

  const generateCover = () => {
    const parsed = parseCoverLetter(sourceCoverLetter);
    const tailored = tailorCoverLetter(parsed, jobTitle, employer, tone, keywordMap);
    commitCover(tailored);
    setActiveTab('cover');
  };

  const useBlankResume = () => {
    commitResume(blankResume());
    setActiveTab('resume');
  };

  const useBlankCover = () => {
    commitCover(blankCover());
    setActiveTab('cover');
  };

  /* Exports — flush pending edits, then read from refs (latest synchronous value) */

  const doExport = (kind) => {
    // Flush any focused contentEditable: blur fires its onBlur, which calls commit{Resume,Cover},
    // which writes synchronously to the ref. After this line, refs hold the latest edited state.
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    const active = activeTab === 'resume' ? resumeDataRef.current : coverDataRef.current;
    if (!active) {
      showNotif('Nothing to export — generate or use a blank template first.');
      return;
    }
    if (kind === 'text') {
      const text = activeTab === 'resume' ? resumeToText(active) : coverToText(active);
      navigator.clipboard.writeText(text).then(() => showNotif('Plain text copied.'));
    } else if (kind === 'md') {
      const md = activeTab === 'resume' ? resumeToMarkdown(active) : coverToMarkdown(active);
      navigator.clipboard.writeText(md).then(() => showNotif('Markdown copied.'));
    } else if (kind === 'print') {
      document.body.dataset.printTarget = activeTab;
      window.print();
      setTimeout(() => { delete document.body.dataset.printTarget; }, 200);
    }
  };

  /* Styles */
  const colors = {
    bg: '#0f0f0f', bg2: '#161616', bg3: '#1e1e1e', bg4: '#252525',
    border: '#333', border2: '#3f3f3f',
    text: '#e8e8e8', text2: '#a0a0a0', text3: '#666',
    accent: '#c9a96e', accent2: '#7eb3d4', green: '#639922',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      color: colors.text,
      fontFamily: 'Georgia, serif',
      padding: '24px 16px 60px',
    }}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          body[data-print-target="resume"] .doc-resume-paper,
          body[data-print-target="resume"] .doc-resume-paper *,
          body[data-print-target="cover"] .doc-cover-paper,
          body[data-print-target="cover"] .doc-cover-paper * {
            visibility: visible !important;
          }
          body[data-print-target="resume"] .doc-resume-paper,
          body[data-print-target="cover"] .doc-cover-paper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 25mm 20mm !important;
            min-height: 0 !important;
            background: white !important;
            box-shadow: none !important;
          }
          @page { margin: 0; size: A4; }
        }
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #aaa;
          font-style: italic;
        }
        [contenteditable]:focus {
          outline: 1px dotted ${colors.accent};
          outline-offset: 2px;
        }
        .cc-input, .cc-textarea, .cc-select {
          width: 100%;
          background: ${colors.bg3};
          border: 0.5px solid ${colors.border};
          border-radius: 4px;
          color: ${colors.text};
          padding: 8px 10px;
          font-family: Georgia, serif;
          font-size: 13px;
          outline: none;
          transition: border-color .15s;
        }
        .cc-textarea { resize: vertical; line-height: 1.55; }
        .cc-input:focus, .cc-textarea:focus, .cc-select:focus { border-color: ${colors.accent}; }
        .cc-btn {
          font-family: Georgia, serif;
          cursor: pointer;
          background: ${colors.bg3};
          color: ${colors.text2};
          border: 0.5px solid ${colors.border2};
          border-radius: 4px;
          padding: 8px 18px;
          font-size: 13px;
          letter-spacing: 0.04em;
          transition: all .15s;
        }
        .cc-btn:hover { border-color: ${colors.accent}; color: ${colors.accent}; }
        .cc-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .cc-btn-primary { border-color: ${colors.accent}; color: ${colors.accent}; background: rgba(201,169,110,0.07); }
        .cc-btn-primary:hover { background: rgba(201,169,110,0.16); }
        .cc-btn-cover { border-color: ${colors.accent2}; color: ${colors.accent2}; background: rgba(126,179,212,0.07); }
        .cc-btn-cover:hover { background: rgba(126,179,212,0.16); }
        .cc-btn-blank { border-color: ${colors.text3}; color: ${colors.text2}; background: transparent; }
        .cc-btn-blank:hover { border-color: ${colors.text2}; color: ${colors.text}; }
        .cc-label {
          font-size: 11px;
          color: ${colors.text2};
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 5px;
          font-family: Georgia, serif;
        }
      `}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto' }} className="app-chrome-wrap">
        <div className="app-chrome">
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '28px', paddingBottom: '18px',
            borderBottom: `0.5px solid ${colors.border}`,
          }}>
            <div style={{
              fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: colors.accent, border: `0.5px solid ${colors.accent}`,
              padding: '4px 8px', borderRadius: '3px',
            }}>CareerCopilot</div>
            <div style={{ fontSize: '15px', color: colors.text2, fontStyle: 'italic' }}>Document Builder</div>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <React.Fragment key={i}>
                  {i > 0 && <div style={{ height: '0.5px', background: colors.border, flex: 1, margin: '0 8px' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontFamily: 'monospace',
                      border: `0.5px solid ${done ? colors.green : active ? colors.accent : colors.border2}`,
                      color: done ? colors.green : active ? colors.accent : colors.text3,
                      background: done ? 'rgba(99,153,34,0.08)' : active ? 'rgba(201,169,110,0.08)' : 'transparent',
                      flexShrink: 0,
                    }}>{done ? <Check size={12} /> : i + 1}</div>
                    <div style={{
                      fontSize: '11px',
                      color: done ? colors.green : active ? colors.accent : colors.text3,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>{label}</div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Wizard card */}
          <div style={{
            background: colors.bg2,
            border: `0.5px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px',
          }}>
            {step === 0 && (
              <>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>Source Material</div>
                <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '22px', fontStyle: 'italic' }}>
                  Paste existing documents. Leave blank and use a blank template instead.
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label className="cc-label">Past Resume(s)</label>
                  <textarea className="cc-textarea" rows={8} value={sourceResume}
                    onChange={(e) => setSourceResume(e.target.value)}
                    placeholder="Paste one or more past resumes…" />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label className="cc-label">Past Cover Letter(s)</label>
                  <textarea className="cc-textarea" rows={6} value={sourceCoverLetter}
                    onChange={(e) => setSourceCoverLetter(e.target.value)}
                    placeholder="Paste past cover letters…" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="cc-btn cc-btn-primary" onClick={() => setStep(1)}>
                    Job Target <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>Job Target</div>
                <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '22px', fontStyle: 'italic' }}>
                  Describe the role you are applying for.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="cc-label">Job Title</label>
                    <input className="cc-input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="cc-label">Employer Name</label>
                    <input className="cc-input" value={employer} onChange={(e) => setEmployer(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label className="cc-label">Position Description</label>
                  <textarea className="cc-textarea" rows={5} value={positionDesc}
                    onChange={(e) => setPositionDesc(e.target.value)} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label className="cc-label">Roles &amp; Responsibilities</label>
                  <textarea className="cc-textarea" rows={4} value={rolesResp}
                    onChange={(e) => setRolesResp(e.target.value)} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label className="cc-label">Key Selection Criteria</label>
                  <textarea className="cc-textarea" rows={4} value={ksc}
                    onChange={(e) => setKsc(e.target.value)}
                    placeholder="One criterion per line…" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button className="cc-btn" onClick={() => setStep(0)}>
                    <ChevronLeft size={14} style={{ verticalAlign: 'middle' }} /> Back
                  </button>
                  <button className="cc-btn cc-btn-primary" onClick={() => setStep(2)}>
                    Preferences <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>Preferences &amp; Generate</div>
                <div style={{ fontSize: '13px', color: colors.text2, marginBottom: '22px', fontStyle: 'italic' }}>
                  Set options then generate each document independently.
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="cc-label">User Notes</label>
                  <textarea className="cc-textarea" rows={3} value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Additional instructions, things to emphasise, things to avoid…" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{
                    background: colors.bg3, border: `0.5px solid ${colors.border2}`,
                    borderRadius: '6px', padding: '14px',
                  }}>
                    <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.text3, marginBottom: '12px' }}>Resume</div>
                    <label className="cc-label">Template</label>
                    <select className="cc-select" value={templateKey} onChange={(e) => setTemplateKey(e.target.value)} style={{ marginBottom: '12px' }}>
                      {Object.entries(TEMPLATES).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                    <button className="cc-btn cc-btn-primary" onClick={generateResume} style={{ width: '100%', marginBottom: '8px' }}>
                      Generate Resume
                    </button>
                    <button className="cc-btn cc-btn-blank" onClick={useBlankResume} style={{ width: '100%' }}>
                      Use Blank Resume Template
                    </button>
                  </div>
                  <div style={{
                    background: colors.bg3, border: `0.5px solid ${colors.border2}`,
                    borderRadius: '6px', padding: '14px',
                  }}>
                    <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: colors.text3, marginBottom: '12px' }}>Cover Letter</div>
                    <label className="cc-label">Tone</label>
                    <select className="cc-select" value={tone} onChange={(e) => setTone(e.target.value)} style={{ marginBottom: '12px' }}>
                      {Object.entries(TONES).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                    <button className="cc-btn cc-btn-cover" onClick={generateCover} style={{ width: '100%', marginBottom: '8px' }}>
                      Generate Cover Letter
                    </button>
                    <button className="cc-btn cc-btn-blank" onClick={useBlankCover} style={{ width: '100%' }}>
                      Use Blank Cover Letter Template
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '18px' }}>
                  <button className="cc-btn" onClick={() => setStep(1)}>
                    <ChevronLeft size={14} style={{ verticalAlign: 'middle' }} /> Back
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Output region — always rendered from first load.
              Empty states display until the user generates or chooses a blank template. */}
          <div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px', flexWrap: 'wrap', gap: '10px',
              }}>
                <div style={{
                  display: 'flex', border: `0.5px solid ${colors.border}`,
                  borderRadius: '5px', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setActiveTab('resume')}
                    style={{
                      padding: '7px 16px', fontSize: '12px',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      border: 'none', cursor: 'pointer',
                      borderRight: `0.5px solid ${colors.border}`,
                      fontFamily: 'Georgia, serif',
                      background: activeTab === 'resume' ? colors.bg4 : colors.bg3,
                      color: activeTab === 'resume' ? colors.text : colors.text3,
                    }}
                  >Tailored Resume</button>
                  <button
                    onClick={() => setActiveTab('cover')}
                    style={{
                      padding: '7px 16px', fontSize: '12px',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      border: 'none', cursor: 'pointer',
                      fontFamily: 'Georgia, serif',
                      background: activeTab === 'cover' ? colors.bg4 : colors.bg3,
                      color: activeTab === 'cover' ? colors.text : colors.text3,
                    }}
                  >Cover Letter</button>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="cc-btn" onClick={() => doExport('text')} style={{ padding: '6px 12px', fontSize: '11px' }}>
                    <Copy size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Copy Text
                  </button>
                  <button className="cc-btn" onClick={() => doExport('md')} style={{ padding: '6px 12px', fontSize: '11px' }}>
                    <FileText size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Copy Markdown
                  </button>
                  <button className="cc-btn" onClick={() => doExport('print')} style={{ padding: '6px 12px', fontSize: '11px' }}>
                    <Printer size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Print
                  </button>
                </div>
              </div>

              <div style={{
                background: colors.bg2,
                border: `0.5px solid ${colors.border}`,
                borderRadius: '6px',
                padding: '16px',
              }}>
                {/* Resume tab */}
                <div style={{ display: activeTab === 'resume' ? 'block' : 'none' }}>
                  {resumeData ? (
                    <div style={{ background: '#fff', borderRadius: '3px', overflow: 'hidden' }}>
                      <ResumeDocument data={resumeData} setData={commitResume} template={template} />
                    </div>
                  ) : (
                    <EmptyState
                      colors={colors}
                      icon={<FileX size={28} color={colors.text3} />}
                      title="Resume not yet generated"
                      hint="Generate from your source material above, or start with a blank scaffold."
                      actions={[
                        { label: 'Generate Resume', onClick: generateResume, primary: true },
                        { label: 'Use Blank Resume Template', onClick: useBlankResume },
                      ]}
                    />
                  )}
                </div>

                {/* Cover letter tab */}
                <div style={{ display: activeTab === 'cover' ? 'block' : 'none' }}>
                  {coverData ? (
                    <div style={{ background: '#fff', borderRadius: '3px', overflow: 'hidden' }}>
                      <CoverLetterDocument data={coverData} setData={commitCover} template={template} />
                    </div>
                  ) : (
                    <EmptyState
                      colors={colors}
                      icon={<FilePlus size={28} color={colors.text3} />}
                      title="Cover letter not yet generated"
                      hint="Generate from your source material above, or start with a blank scaffold."
                      actions={[
                        { label: 'Generate Cover Letter', onClick: generateCover, cover: true },
                        { label: 'Use Blank Cover Letter Template', onClick: useBlankCover },
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Notification */}
      {notif && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px',
          background: colors.bg4, border: `0.5px solid ${colors.border2}`,
          borderRadius: '5px', padding: '10px 16px',
          fontSize: '12px', color: colors.text2, zIndex: 99,
          fontFamily: 'Georgia, serif',
        }}>{notif}</div>
      )}
    </div>
  );
}

function EmptyState({ colors, icon, title, hint, actions }) {
  return (
    <div style={{
      padding: '60px 24px',
      textAlign: 'center',
      color: colors.text2,
      fontFamily: 'Georgia, serif',
    }}>
      <div style={{ marginBottom: '14px' }}>{icon}</div>
      <div style={{ fontSize: '15px', color: colors.text, marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: colors.text3, marginBottom: '22px', fontStyle: 'italic' }}>{hint}</div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {actions.map((a, i) => (
          <button key={i}
            className={`cc-btn ${a.primary ? 'cc-btn-primary' : a.cover ? 'cc-btn-cover' : 'cc-btn-blank'}`}
            onClick={a.onClick}>{a.label}</button>
        ))}
      </div>
    </div>
  );
}
