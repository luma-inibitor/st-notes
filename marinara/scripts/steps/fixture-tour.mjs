// Screenshots every chat seeded from the shipped fixtures.
//
//   node $HARNESS/drive-browser.mjs $HARNESS/steps/fixture-tour.mjs
//
// Use it to check that a fixture actually renders — reactions and day dividers
// in Conversation, long prose turns in Roleplay, and the HUD, party, and choice
// cards in Game. It scrolls each chat to its oldest message and back, which is
// the cheapest way to see whether the seeded history is long enough to page.
//
// Every navigation is idempotent: the profile is reused between runs, so a
// blind click would toggle state rather than set it.

// The chat list is split into one tab per mode, so a chat is only findable
// while its own tab is selected. Entries are "TAB:chat name".
const CHATS = (
  process.env.UIUX_CHAT_NAMES ??
  "CONVO:Devi — the Marcus problem|RP:Holmes — the Stoke Moran business|GM:The Ashfall Contract"
)
  .split("|")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const separator = entry.indexOf(":");
    return { tab: entry.slice(0, separator), name: entry.slice(separator + 1) };
  });

/**
 * A fresh profile lands on the welcome tour, and after a version change on the
 * "What's New?" dialog. The dialog takes the pointer, so every later click
 * times out on its backdrop; the tour does not, it just covers the screenshot.
 */
async function dismissOverlays({ page }) {
  // The welcome tour mounts a second or two after the page settles, so an
  // empty first look is not proof that nothing is coming: give it one more.
  let consecutiveClear = 0;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    // Dispatched from inside the page: a modal's own backdrop sits over its
    // buttons, so Playwright's actionability check never passes on them.
    const dismissed = await page.evaluate(() => {
      // Match on the button rather than its container. The welcome tour and
      // the Game Mode tutorial are chrome popovers, not dialogs, and they nest
      // differently; both, however, offer a button with one of these labels.
      const escape = [...document.querySelectorAll("button")].find(
        (candidate) =>
          candidate.getBoundingClientRect().width > 0 &&
          /^(skip|skip tutorial|got it|dismiss)$/i.test((candidate.innerText || "").trim()),
      );
      if (escape) {
        escape.click();
        return "clicked";
      }
      const modal = [...document.querySelectorAll('[role="dialog"], [data-component="Modal"]')].find(
        (node) => node.getBoundingClientRect().width > 0,
      );
      return modal ? "stuck" : "none";
    });
    if (dismissed === "none") {
      consecutiveClear += 1;
      if (consecutiveClear >= 2) break;
    } else {
      consecutiveClear = 0;
      if (dismissed === "stuck") await page.keyboard.press("Escape");
    }
    await page.waitForTimeout(1500);
  }
}

/**
 * Click the first on-screen button whose label matches. The layout keeps a
 * second, off-screen copy of the mode tabs and the game controls for narrow
 * viewports, and Playwright's role selector finds that one first.
 */
async function clickVisibleButton({ page }, pattern) {
  const clicked = await page.evaluate((source) => {
    const matcher = new RegExp(source, "i");
    const button = [...document.querySelectorAll("button")].find((candidate) => {
      const box = candidate.getBoundingClientRect();
      if (box.width === 0 || box.bottom < 0 || box.top > window.innerHeight) return false;
      return matcher.test((candidate.innerText || candidate.ariaLabel || "").trim());
    });
    if (!button) return false;
    button.click();
    return true;
  }, pattern.source ?? pattern);
  if (clicked) await page.waitForTimeout(1200);
  return clicked;
}

async function openChat({ page }, name) {
  // Sidebar rows truncate long names with an ellipsis, so match on a prefix and
  // click the on-screen row rather than a duplicate in the off-screen layout.
  const opened = await page.evaluate((prefix) => {
    const rows = [...document.querySelectorAll("div, span, button, a")].filter((node) => {
      const box = node.getBoundingClientRect();
      if (box.width === 0 || box.top > window.innerHeight || box.bottom < 0) return false;
      const text = (node.innerText || "").trim();
      return text.length > 0 && text.length < 200 && text.startsWith(prefix);
    });
    const row = rows.at(-1);
    if (!row) return false;
    row.click();
    return true;
  }, name.slice(0, 12));
  if (!opened) {
    console.log(`chat "${name}" not found; seed it with $HARNESS/seed-chat.mjs`);
    return false;
  }
  await page.waitForTimeout(3000);
  return true;
}

/** Scroll the tallest scrollable pane, which is the transcript in every mode. */
async function scrollTranscript({ page }, direction) {
  await page.evaluate((dir) => {
    const panes = [...document.querySelectorAll("*")].filter(
      (node) => node.scrollHeight > node.clientHeight + 200 && node.clientHeight > 300,
    );
    const pane = panes.sort((a, b) => b.clientHeight - a.clientHeight)[0];
    if (pane) pane.scrollTop = dir === "top" ? 0 : pane.scrollHeight;
  }, direction);
  await page.waitForTimeout(1500);
}

export default async function fixtureTour(ctx) {
  const { page, baseUrl, shot, consoleErrors } = ctx;
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(3000);

  await dismissOverlays(ctx);
  await shot("home");

  for (const { tab, name } of CHATS) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
    await clickVisibleButton(ctx, new RegExp(`^${tab}$`));
    if (!(await openChat(ctx, name))) continue;
    // Game chats open their own tutorial the first time a game surface mounts.
    await dismissOverlays(ctx);
    await shot(`${slug}-latest`);

    // Game mode replays one turn at a time instead of scrolling a transcript,
    // so its history lives behind the Logs button.
    if (await clickVisibleButton(ctx, /^Logs$/)) {
      await page.waitForTimeout(1000);
      await shot(`${slug}-logs`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(800);
      continue;
    }

    await scrollTranscript(ctx, "top");
    await shot(`${slug}-oldest`);
    await scrollTranscript(ctx, "bottom");
  }

  if (consoleErrors.length) console.log(`console errors: ${consoleErrors.length}`);
}
