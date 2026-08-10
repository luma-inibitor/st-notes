// Example responder for $HARNESS/start-mock-provider.mjs.
//
// The generic schema synthesizer in the mock provider produces valid but empty
// placeholder data. A responder replaces that with content the agent's UI can
// actually display, which is what you want when the screenshots are the point.
//
// This example is modelled on the Long-Term Memory package, whose extraction
// call asks for `{ summary, units[] }` and pins `units[].sourceHash` to a
// single-value enum that must be echoed back. It is only an example: write your
// own by capturing a real request first.
//
//   node $HARNESS/start-mock-provider.mjs --capture-dir .tmp/uiux/capture
//   # trigger the agent from the UI, then read .tmp/uiux/capture/last-request.json
//
// Usage:
//   node $HARNESS/start-mock-provider.mjs \
//     --responder $HARNESS/responders/example-schema-responder.mjs
//
// The default export receives { body, messages, text, schema, helpers } and may
// return a string, an object (serialized as JSON), or null to let the mock
// provider fall back to generic schema synthesis.

const FACTS = [
  {
    sectionKey: "role",
    title: "occupation",
    text: "%s owns and runs a bookshop, and knows the regular customers by name.",
    importance: "major",
    keywords: ["bookshop", "owner", "regulars"],
  },
  {
    sectionKey: "habit",
    title: "keeps a notebook",
    text: "%s writes down what regulars mention and refers back to it in later conversations.",
    importance: "major",
    keywords: ["notebook", "memory"],
  },
  {
    sectionKey: "voice",
    title: "manner",
    text: "%s is warm, dryly funny, and attentive without being pushy.",
    importance: "moderate",
    keywords: ["warm", "dry humour", "attentive"],
  },
];

export default function respond({ text, schema, helpers }) {
  const unitProperties = schema?.properties?.units?.items?.properties;
  if (!unitProperties) return null;

  // The engine pins the source identity with a single-value enum. Echo it back
  // verbatim, otherwise the package discards the response as unattributable.
  const sourceHash = unitProperties.sourceHash?.enum?.[0];
  const evidenceRef = text.match(/source_note:[A-Za-z0-9_-]+/)?.[0];
  if (!sourceHash || !evidenceRef) return null;

  // Name the subject from the prompt so the drafts attach to the right card.
  const subject = text.match(/"name"\s*:\s*"([^"]{1,60})"/)?.[1] ?? "Subject";
  const slug = subject.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "subject";

  return {
    summary: `Extracted ${FACTS.length} durable character facts about ${subject}.`,
    units: FACTS.map((fact) => ({
      id: helpers.stableUuid(),
      bucket: "character_fact",
      subjectId: `char_${slug}`,
      sectionKey: fact.sectionKey,
      title: `${subject}'s ${fact.title}`,
      text: fact.text.replace("%s", subject),
      claimKind: "static",
      importance: fact.importance,
      keywords: fact.keywords,
      evidence: [evidenceRef],
      confidence: 0.9,
      salience: 0.7,
      status: "active",
      links: [],
      sourceHash,
      subjectNames: [subject],
    })),
  };
}
