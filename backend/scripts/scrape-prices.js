const PriceScraper = require('../src/services/priceScraper');
const { Pool } = require('pg');
require('dotenv').config();

async function runPriceScraping() {
  const scraper = new PriceScraper();
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });
  
  try {
    console.log('Starting scheduled price scraping...');
    
    // Log start
    const logResult = await pool.query(`
      INSERT INTO scraping_logs (status, started_at)
      VALUES ('running', CURRENT_TIMESTAMP)
      RETURNING id
    `);
    const logId = logResult.rows[0].id;
    
    // Run scraping
    const result = await scraper.scrapeAllPrices();
    
    // Log completion
    await pool.query(`
      UPDATE scraping_logs
      SET status = $1,
          materials_updated = $2,
          completed_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [
      result.success ? 'completed' : 'failed',
      result.updated || 0,
      logId
    ]);
    
    console.log('Price scraping completed:', result);
    process.exit(0);
    
  } catch (error) {
    console.error('Price scraping failed:', error);
    process.exit(1);
  }
}

runPriceScraping();