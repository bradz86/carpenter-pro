-- Retailer prices table
CREATE TABLE IF NOT EXISTS retailer_prices (
  id SERIAL PRIMARY KEY,
  material_id INTEGER REFERENCES material_prices(id),
  retailer VARCHAR(100) NOT NULL,
  price DECIMAL(10,2),
  url TEXT,
  in_stock BOOLEAN DEFAULT true,
  last_scraped TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(material_id, retailer)
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
  id SERIAL PRIMARY KEY,
  material_id INTEGER REFERENCES material_prices(id),
  old_price DECIMAL(10,2),
  new_price DECIMAL(10,2),
  change_percent DECIMAL(5,2),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scraping logs table
CREATE TABLE IF NOT EXISTS scraping_logs (
  id SERIAL PRIMARY KEY,
  status VARCHAR(50),
  materials_updated INTEGER,
  errors TEXT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_retailer_prices_material ON retailer_prices(material_id);
CREATE INDEX idx_price_alerts_material ON price_alerts(material_id);
CREATE INDEX idx_price_alerts_created ON price_alerts(created_at);

-- Add source column to price_history if it doesn't exist
ALTER TABLE price_history ADD COLUMN IF NOT EXISTS source VARCHAR(100);