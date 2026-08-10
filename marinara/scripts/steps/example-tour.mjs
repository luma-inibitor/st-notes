// Example step for $HARNESS/drive-browser.mjs.
//
//   node $HARNESS/drive-browser.mjs $HARNESS/steps/example-tour.mjs
//
// It opens the app, dismisses the tutorial if it appears, opens a seeded chat,
// opens Chat Settings, and expands the Agents section. Copy this file and edit
// it for whatever you are exploring; each run reuses the same browser profile,
// so a later step starts where this one left off.
//
// Every navigation here is idempotent: it checks whether the target is already
// visible before clicking. Panels and accordions remember their state across
// page loads, so a blind "click to expand" closes them on the second run.

const CHAT_NAME = process.env.UIUX_CHAT_NAME ?? "Wren — memory test";

export default async function exampleTour({ page, baseUrl, shot, outline, clickText }) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(3000);

  const skip = page.getByRole("button", { name: /Skip Tutorial/i });
  if (await skip.count()) {
    await skip.first().click();
    await page.waitForTimeout(800);
  }
  await shot("home");

  const chat = page.getByText(CHAT_NAME, { exact: false });
  if (await chat.count()) {
    await chat.first().click();
    await page.waitForTimeout(3000);
  } else {
    console.log(`chat "${CHAT_NAME}" not found; seed one with $HARNESS/seed-chat.mjs`);
  }

  // Icon-only controls carry aria-label or title but no text.
  const settings = page.locator('button[aria-label="Chat Settings"], button[title="Chat Settings"]');
  if (await settings.count()) {
    await settings.first().click();
    await page.waitForTimeout(2000);
  }
  await shot("chat-settings");

  // Expand Agents only when its contents are not already on screen.
  const agentsExpanded = await page.evaluate(() =>
    [...document.querySelectorAll("button")].some((button) =>
      (button.innerText || "").includes("Open Long-Term Memory settings"),
    ),
  );
  if (!agentsExpanded) {
    console.log("agents ->", await clickText("Agents", { exact: true }));
    await page.waitForTimeout(2200);
  }
  await shot("agents-section");

  // To flip a toggle, add `setCheckbox` to the parameters above and call it
  // with the start of the row label, for example:
  //   console.log(await setCheckbox("Long-Term Memory", true));

  console.log("--- outline ---");
  await outline("body");
}
