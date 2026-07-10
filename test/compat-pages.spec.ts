import { expect, test, type Locator } from "@playwright/test";

const basicCompatPages = [
  { name: "Vue 2.6", path: "/vue2.6.html" },
  { name: "Vue 2.7", path: "/vue2.7.html" },
  { name: "Vue 3", path: "/vue3.html" },
] as const;

const compatCasePages = [
  { name: "Vue 2.6", path: "/vue2.6-cases.html" },
  { name: "Vue 2.7", path: "/vue2.7-cases.html" },
  { name: "Vue 3", path: "/vue3-cases.html" },
] as const;

async function getNormalizedText(locator: Locator) {
  return (await locator.innerText()).replace(/\s+/g, "");
}

async function expectEllipsis(locator: Locator, timeout = 10000) {
  await expect
    .poll(async () => getNormalizedText(locator), { timeout })
    .toContain("...");
}

for (const { name, path } of basicCompatPages) {
  test(`${name} 基础示例应完成省略且不显示展开按钮`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const container = page.locator('[data-container="text-ellipsis"]');
    await expect(container).toBeVisible({ timeout: 10000 });

    const text = await getNormalizedText(container);
    expect(text).toContain("...");
    expect(text).not.toContain("展开");

    await expect(page.locator('[data-measure]')).toHaveCount(0);
    await expect(container.locator("button")).toHaveCount(0);
  });
}

for (const { name, path } of compatCasePages) {
  test(`${name} 功能矩阵应覆盖 start/end/middle/rows`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const middle = page.locator(
      '[data-case="middle"] [data-container="text-ellipsis"]',
    );
    const start = page.locator(
      '[data-case="start"] [data-container="text-ellipsis"]',
    );
    const end = page.locator(
      '[data-case="end"] [data-container="text-ellipsis"]',
    );
    const rows = page.locator(
      '[data-case="rows"] [data-container="text-ellipsis"]',
    );

    await expect(middle).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-measure]')).toHaveCount(0);

    const middleText = await getNormalizedText(middle);
    const startText = await getNormalizedText(start);
    const endText = await getNormalizedText(end);
    const rowsText = await getNormalizedText(rows);

    expect(middleText).toContain("...");
    expect(middleText.startsWith("...")).toBe(false);
    expect(middleText.endsWith("...")).toBe(false);

    expect(startText.startsWith("...")).toBe(true);
    expect(endText.endsWith("...")).toBe(true);

    expect(rowsText).toContain("...");
    const rowsHeight = await rows.evaluate((element) => element.offsetHeight);
    expect(rowsHeight).toBeGreaterThan(30);
  });

  test(`${name} expandNode 插槽点击应展开和收起`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const expand = page.locator(
      '[data-case="expand"] [data-container="text-ellipsis"]',
    );
    const expandButton = page.locator('[data-case="expand"] [data-action="expand"]');
    const collapseButton = page.locator(
      '[data-case="expand"] [data-action="collapse"]',
    );

    await expect(expandButton).toBeVisible({ timeout: 10000 });
    expect(await getNormalizedText(expand)).toContain("...");

    await expandButton.click();
    await expect(collapseButton).toBeVisible();

    const expandedText = await getNormalizedText(expand);
    expect(expandedText).not.toContain("...");
    expect(expandedText).toContain("再次点击后恢复省略");

    await collapseButton.click();
    await expectEllipsis(expand);
    await expect
      .poll(async () => expandButton.isVisible(), { timeout: 10000 })
      .toBe(true);
    await expect(page.locator('[data-measure]')).toHaveCount(0);
    await expect(expand.locator("button")).toHaveCount(1);
  });

  test(`${name} useObserver 进入视口后应完成省略`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const observer = page.locator(
      '[data-case="observer"] [data-container="text-ellipsis"]',
    );

    const textBeforeScroll = await getNormalizedText(observer);
    expect(textBeforeScroll).not.toContain("...");

    await observer.scrollIntoViewIfNeeded();
    await expectEllipsis(observer, 15000);
    await expect(page.locator('[data-measure]')).toHaveCount(0);
  });

  test(`${name} 容器宽度变化应重新计算省略`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const resize = page.locator(
      '[data-case="resize"] [data-container="text-ellipsis"]',
    );

    await expect(resize).toBeVisible({ timeout: 10000 });

    await page.locator('[data-case="resize"] [data-action="narrow"]').click();
    await expectEllipsis(resize);

    await page.locator('[data-case="resize"] [data-action="wide"]').click();
    const resizeBox = page.locator('[data-case="resize"] [data-resize-box]');
    await expect
      .poll(async () => resizeBox.evaluate((element) => element.clientWidth))
      .toBeGreaterThan(400);

    await expect
      .poll(async () => getNormalizedText(resize), { timeout: 10000 })
      .toContain("宽容器会显示完整内容");

    await page.locator('[data-case="resize"] [data-action="narrow"]').click();
    await expectEllipsis(resize);
    await expect(page.locator('[data-measure]')).toHaveCount(0);
  });
}
