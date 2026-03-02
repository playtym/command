import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5173/command';
const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');

// iPhone 14 Pro dimensions for high-quality mobile screenshots
const DEVICE = {
  width: 393,
  height: 852,
  deviceScaleFactor: 3, // 3x for crisp retina screenshots
};

const PAGES = [
  { name: '01-Action-Home',       hash: '/' },
  { name: '02-Dashboard-Overview', hash: '/overview' },
  { name: '03-Money',             hash: '/money' },
  { name: '04-Spend',             hash: '/spend' },
  { name: '05-Advisor',           hash: '/advisor' },
  { name: '06-Rewards',           hash: '/rewards' },
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshots() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Set iPhone 14 Pro viewport
  await page.setViewport({
    width: DEVICE.width,
    height: DEVICE.height,
    deviceScaleFactor: DEVICE.deviceScaleFactor,
  });

  // Set a user agent that looks like a mobile device
  await page.setUserAgent(
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  );

  for (const { name, hash } of PAGES) {
    const url = hash === '/' ? `${BASE_URL}/` : `${BASE_URL}/#${hash}`;
    console.log(`📸 Capturing: ${name} (${url})`);

    // For the Action page, capture intro screens first, then skip for main view
    if (hash === '/') {
      // Clear localStorage to show intro
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluate(() => {
        localStorage.removeItem('command_intro_seen');
        localStorage.removeItem('command_checkin_date');
      });

      // Reload to trigger intro
      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 30000 });
      await sleep(2000);

      // Capture Intro Screen 1 - "Total Money Saved"
      const intro1File = path.join(OUTPUT_DIR, '00a-Intro-Money-Saved.png');
      await page.screenshot({
        path: intro1File,
        type: 'png',
        clip: { x: 0, y: 0, width: DEVICE.width, height: DEVICE.height },
      });
      console.log(`   ✅ Saved: ${intro1File}`);

      // Click to advance to step 2
      await page.click('body');
      await sleep(1500);

      // Capture Intro Screen 2 - "Could Still Save"
      const intro2File = path.join(OUTPUT_DIR, '00b-Intro-Could-Save.png');
      await page.screenshot({
        path: intro2File,
        type: 'png',
        clip: { x: 0, y: 0, width: DEVICE.width, height: DEVICE.height },
      });
      console.log(`   ✅ Saved: ${intro2File}`);

      // Skip intro for main Action page screenshot
      await page.evaluate(() => {
        localStorage.setItem('command_intro_seen', '1');
        localStorage.setItem('command_checkin_date', new Date().toDateString());
      });
    }

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for animations and fonts to settle
    await sleep(2000);

    // Wait for all images and fonts to load
    await page.evaluate(() => document.fonts.ready);

    // Take viewport screenshot (what the user sees on phone)
    const viewportFile = path.join(OUTPUT_DIR, `${name}.png`);
    await page.screenshot({
      path: viewportFile,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: DEVICE.width,
        height: DEVICE.height,
      },
    });
    console.log(`   ✅ Saved: ${viewportFile}`);

    // Also take a full-page screenshot (scrollable content)
    const fullFile = path.join(OUTPUT_DIR, `${name}-full.png`);
    await page.screenshot({
      path: fullFile,
      type: 'png',
      fullPage: true,
    });
    console.log(`   ✅ Saved: ${fullFile}`);
  }

  // Bonus: Capture the Advisor page with a conversation active
  console.log('📸 Capturing: Advisor with active conversation...');
  
  // First, navigate to base URL and set localStorage to skip intro
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => {
    localStorage.setItem('command_intro_seen', '1');
    localStorage.setItem('command_checkin_date', new Date().toDateString());
  });
  
  // Now navigate to Action page (intro will be skipped)
  await page.goto(`${BASE_URL}/#/`, { waitUntil: 'networkidle0', timeout: 30000 });
  await sleep(2500);
  
  try {
    // The action cards are clickable divs. Find one with the action title text.
    const clicked = await page.evaluate(() => {
      // Look for h4 elements with action titles inside clickable cards
      const h4s = document.querySelectorAll('h4');
      for (const h4 of h4s) {
        const card = h4.closest('div[style*="min-width"]');
        if (card) {
          card.click();
          return h4.textContent;
        }
      }
      return false;
    });

    if (clicked) {
      // Wait for navigation and AI response typing animation
      await sleep(3500);
      
      const advisorChatFile = path.join(OUTPUT_DIR, '07-Advisor-Chat-Active.png');
      await page.screenshot({
        path: advisorChatFile,
        type: 'png',
        clip: {
          x: 0,
          y: 0,
          width: DEVICE.width,
          height: DEVICE.height,
        },
      });
      console.log(`   ✅ Saved: ${advisorChatFile}`);
      
      // Full page version
      const advisorChatFullFile = path.join(OUTPUT_DIR, '07-Advisor-Chat-Active-full.png');
      await page.screenshot({
        path: advisorChatFullFile,
        type: 'png',
        fullPage: true,
      });
      console.log(`   ✅ Saved: ${advisorChatFullFile}`);
    } else {
      console.log('   ⚠️  Could not find action card to click');
    }
  } catch (e) {
    console.log('   ⚠️  Could not capture advisor chat:', e.message);
  }

  await browser.close();

  console.log('\n✨ All screenshots saved to:', OUTPUT_DIR);
  console.log(`   Resolution: ${DEVICE.width * DEVICE.deviceScaleFactor}x${DEVICE.height * DEVICE.deviceScaleFactor}px (${DEVICE.deviceScaleFactor}x Retina)`);
  
  // List all files
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n📁 ${files.length} screenshots created:`);
  files.forEach(f => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    const sizeKB = (stats.size / 1024).toFixed(0);
    console.log(`   ${f} (${sizeKB} KB)`);
  });
}

takeScreenshots().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
