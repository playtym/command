import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;
// Using HashRouter, so paths must include /#/
const ROUTES = [
  { path: '/#/', name: '01-Action' },
  { path: '/#/overview', name: '02-Dashboard' },
  { path: '/#/money', name: '03-Money' },
  { path: '/#/spend', name: '04-Spend' },
  { path: '/#/rewards', name: '05-Rewards' },
  { path: '/#/advisor', name: '06-Advisor' },
];

(async () => {
    let browser;
    
    try {
        console.log('ℹ️  Using existing server at port', PORT);
        
        // 2. Prepare Output Dir
        await mkdir('screenshots', { recursive: true });

        // 3. Launch Browser
        console.log('📸 Launching browser...');
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { 
                width: 393, 
                height: 852, 
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true
            }
        });

        const page = await browser.newPage();
        
        // Listen for console logs to debug rendering issues
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        
        // Set user agent to simulate iOS
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');

        // 4. Capture Screenshots
        for (const route of ROUTES) {
            console.log(`🖼️  Capturing ${route.name} (${route.path})...`);
            try {
                // Navigate and wait for network activity to settle
                await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0', timeout: 60000 });
                
                // EXTRA SAFETY: Wait for the root element to be present
                await page.waitForSelector('#root', { timeout: 10000 });
                
                // Wait for any initial animations (Framer Motion)
                await new Promise(r => setTimeout(r, 4000));
                
                // Regular screenshot (viewport only - safer for app layouts)
                await page.screenshot({ 
                    path: `screenshots/${route.name}.png`,
                    fullPage: false 
                });
                console.log(`   Saved: screenshots/${route.name}.png`);
            } catch (e) {
                console.error(`❌ Failed to capture ${route.name}:`, e.message);
                // Try taking a screenshot anyway, might capture error state
                try {
                     await page.screenshot({ path: `screenshots/${route.name}-error.png` });
                } catch (err) {}
            }
        }

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        // 5. Cleanup
        if (browser) await browser.close();
        process.exit(0);
    }
})();