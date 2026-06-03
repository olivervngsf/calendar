// Lightweight natural-language parser for quick-add (⌘⇧N).
// Parses a sentence into { title, date, yearly? }. No NLP lib — regex + heuristics.
// Examples it handles:
//   "I want to create Viet's birthday every July 23."
//   "Viet's birthday. July 23. Repeat yearly."
//   "Team offsite Oct 3 2027"
//   "Dentist on 12 March"

export interface QuickAddParse {
  title: string;
  iso: string; // resolved "YYYY-MM-DD"
  year: number;
  month: number; // 0-based
  day: number;
  recurrence: "yearly" | null;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const MONTH_ALT =
  "jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t)?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?";

function monthIndex(s: string): number | null {
  const key = s.slice(0, 3).toLowerCase();
  return key in MONTHS ? MONTHS[key] : null;
}

/** Parse the input relative to `today`. Returns a parse or an `{ error }`. */
export function parseQuickAdd(
  input: string,
  today: Date,
): QuickAddParse | { error: string } {
  const text = input.trim();
  if (!text) return { error: "Try “Viet’s birthday, July 23”." };

  const reMD = new RegExp(
    `\\b(${MONTH_ALT})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`,
    "i",
  );
  const reDM = new RegExp(
    `\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(${MONTH_ALT})\\b(?:,?\\s*(\\d{4}))?`,
    "i",
  );

  let match = text.match(reMD);
  let monStr: string, dayStr: string, yrStr: string | undefined;
  if (match) {
    monStr = match[1];
    dayStr = match[2];
    yrStr = match[3];
  } else {
    match = text.match(reDM);
    if (!match) return { error: "Add a date, e.g. “July 23”." };
    dayStr = match[1];
    monStr = match[2];
    yrStr = match[3];
  }

  const month = monthIndex(monStr);
  const day = parseInt(dayStr, 10);
  if (month === null || day < 1 || day > 31) {
    return { error: "That date didn’t parse — try “July 23”." };
  }

  const lower = text.toLowerCase();
  const yearly =
    /\b(yearly|annually)\b/.test(lower) ||
    /every\s+(year|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(lower) ||
    /repeat[a-z]*\b[^.]*year/.test(lower);
  const recurrence: "yearly" | null = yearly ? "yearly" : null;

  // Year: explicit if given; else current year, rolled forward if already past.
  let year = yrStr ? parseInt(yrStr, 10) : today.getFullYear();
  if (!yrStr) {
    const candidate = new Date(year, month, day);
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    if (candidate < startOfToday) year += 1;
  }

  // Title: strip leading filler, the date phrase, and recurrence words.
  let title = text
    .replace(
      /^\s*(i\s+(?:want|'?d\s+like)\s+to\s+|please\s+)?(?:create|add|new|make|schedule|set\s+up)\s+/i,
      "",
    )
    .replace(match[0], " ")
    .replace(/\b(every|each|recurring|repeat[a-z]*)\b/gi, " ")
    .replace(/\b(yearly|annually|year|weekly|monthly)\b/gi, " ")
    .replace(/\bon\b/gi, " ")
    .replace(/[.,;:·]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .replace(/^[\s\-–—]+|[\s\-–—]+$/g, "")
    .trim();
  if (!title) title = "Untitled";

  const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { title, iso, year, month, day, recurrence };
}
