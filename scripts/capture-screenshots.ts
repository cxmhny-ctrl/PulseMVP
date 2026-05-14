/**
 * Pulse screenshot capture script.
 *
 * Usage:
 *   1. Terminal 1: npm run dev
 *   2. Terminal 2: npx tsx scripts/capture-screenshots.ts
 *   3. Open screenshots/ folder
 *
 * Requires @playwright/test and chromium browser (npx playwright install chromium).
 */

import { chromium } from "@playwright/test";
import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DIR = resolve(process.cwd(), "screenshots");
const VIEWPORT = { width: 1440, height: 1000 };

interface Task {
  id: string;
  title: string;
}

async function ensureScreenshotsDir(): Promise<void> {
  if (!existsSync(SCREENSHOTS_DIR)) {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    console.log(`Created ${SCREENSHOTS_DIR}`);
  }
}

async function checkDevServer(): Promise<void> {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      throw new Error(`Dev server returned ${res.status}`);
    }
    console.log(`Dev server reachable at ${BASE_URL}`);
  } catch (err) {
    console.error(
      `Dev server not reachable at ${BASE_URL}. Run "npm run dev" in another terminal first.`
    );
    process.exit(1);
  }
}

async function getOrCreateTask(): Promise<Task> {
  // Try GET /api/tasks first
  console.log("Fetching existing tasks...");
  const listRes = await fetch(`${BASE_URL}/api/tasks`);
  if (!listRes.ok) {
    throw new Error(`GET /api/tasks returned ${listRes.status}`);
  }
  const tasks: Task[] = await listRes.json();

  if (tasks.length > 0) {
    console.log(`  Found ${tasks.length} task(s). Using "${tasks[0].title}" (${tasks[0].id}).`);
    return tasks[0];
  }

  // No tasks — create one
  console.log('  No tasks found. Creating "Clean Kitchen"...');
  const createRes = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Clean Kitchen",
      energyLevel: "medium",
      preferredChannel: "in_app",
    }),
  });
  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(`POST /api/tasks returned ${createRes.status}: ${body}`);
  }
  const task: Task = await createRes.json();
  console.log(`  Created task "${task.title}" (${task.id}).`);
  return task;
}

const ROUTES: { path: string; file: string }[] = [
  { path: "/", file: "01-home.png" },
  { path: "/dashboard", file: "02-dashboard.png" },
  { path: "/tasks/new", file: "03-new-task.png" },
  { path: "/summary", file: "05-summary.png" },
  { path: "/interventions", file: "06-history.png" },
  { path: "/settings", file: "07-settings.png" },
];

async function main(): Promise<void> {
  console.log("Pulse — screenshot capture\n");

  await checkDevServer();
  await ensureScreenshotsDir();

  let task: Task;
  try {
    task = await getOrCreateTask();
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  console.log("\nLaunching Chromium...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  try {
    // Static routes
    for (const route of ROUTES) {
      const url = `${BASE_URL}${route.path}`;
      console.log(`Capturing ${route.path}...`);
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.screenshot({
        path: resolve(SCREENSHOTS_DIR, route.file),
        fullPage: true,
      });
      console.log(`  -> ${route.file}`);
    }

    // Stuck Mode (dynamic route)
    const stuckUrl = `${BASE_URL}/stuck/${task.id}`;
    console.log(`Capturing /stuck/${task.id}...`);
    await page.goto(stuckUrl, { waitUntil: "networkidle", timeout: 15000 });
    await page.screenshot({
      path: resolve(SCREENSHOTS_DIR, "04-stuck-mode.png"),
      fullPage: true,
    });
    console.log("  -> 04-stuck-mode.png");

    console.log(`\nAll ${ROUTES.length + 1} screenshots saved to screenshots/`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
