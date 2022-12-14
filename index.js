#!/usr/bin/env node
import inquirer from "inquirer";
import puppeteer from "puppeteer";
import chalk from "chalk";
import { readFile } from "fs/promises";
import fs from "fs";
import looksSame from "looks-same";

const file = await main();
await theThing(file);

async function main() {
  console.log(chalk.bgYellow.black("\n Hi! \n\n"));
  console.log(chalk.blackBright("The expected file is .json ex:\n"));
  console.log(chalk.blackBright("["));
  console.log(chalk.blackBright("  {"));
  console.log(chalk.blackBright('    "name": "pageName",'));
  console.log(chalk.blackBright('    "base": "https://www.example.com",'));
  console.log(chalk.blackBright('    "compare": "https://www.example.com"'));
  console.log(chalk.blackBright("  }"));
  console.log(chalk.blackBright("]\n"));

  const file = await inquirer.prompt({
    type: "input",
    name: "file",
    message: "What file would you like to read?",
    default: "urls.json",
  });

  return file.file;
}

async function theThing(file) {
  const urls = JSON.parse(await readFile(new URL(file, import.meta.url)));

  console.log(chalk.blackBright("\n\nStarting..."));
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let index = 0; index < urls.length; index++) {
    console.log(chalk.yellow("\n\nCreating base screenshot"));
    console.log(chalk.blackBright(`Navigating to ${urls[index].base}...`));
    await navigateTo(urls[index].base, page, urls[index].wait);
    console.log(
      chalk.blackBright(`Taking screenshot of ${urls[index].base}...`)
    );
    await takeScreenshot(page, urls[index].name, "base");

    console.log(chalk.yellow("\n\nCreating compare screenshot"));
    console.log(chalk.blackBright(`Navigating to ${urls[index].compare}...`));
    await navigateTo(urls[index].compare, page, urls[index].wait);
    console.log(
      chalk.blackBright(`Taking screenshot of ${urls[index].compare}...`)
    );
    await takeScreenshot(page, urls[index].name, "compare");

    console.log(chalk.yellow("\n\nCreating diff screenshot"));
    await createDiffImage(urls[index].name);
    console.log(chalk.blackBright(`Diff created for ${urls[index].name}`));
  }
  await browser.close();
}

async function createDiffImage(name) {
  await looksSame.createDiff({
    reference: `screenshots/${name}/base.png`,
    current: `screenshots/${name}/compare.png`,
    diff: `screenshots/${name}/diff.png`,
    highlightColor: "#ff00ff",
    strict: true,
  });
}

async function navigateTo(url, page, wait) {
  await page.goto(url, { waitUntil: "networkidle2" });

  if (wait) {
    console.log(chalk.blackBright(`Waiting ${wait}s...`));
    await sleep(wait);
  }
}

function sleep(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

async function takeScreenshot(page, pageName, fileName) {
  if (!fs.existsSync(`./screenshots/${pageName}`, { recursive: true })) {
    fs.mkdirSync(`./screenshots/${pageName}`, { recursive: true });
  }

  await page.screenshot({
    path: `screenshots/${pageName}/${fileName}.png`,
    fullPage: true,
  });
}
