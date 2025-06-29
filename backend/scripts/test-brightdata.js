const axios = require('axios');
require('dotenv').config();

// Test Bright Data proxy connection
async function testBrightDataConnection() {
  console.log('Testing Bright Data proxy connection...\n');
  
  // Test configuration
  const testConfig = {
    proxy: {
      host: 'brd.superproxy.io',
      port: 22225,
      auth: {
        username: process.env.BRIGHT_DATA_USERNAME || 'your-username-here',
        password: process.env.BRIGHT_DATA_PASSWORD || 'your-password-here'
      }
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    timeout: 30000
  };

  // Test URLs
  const testUrls = [
    {
      name: 'IP Check',
      url: 'http://lumtest.com/myip.json',
      description: 'Verifies proxy is working and shows exit IP'
    },
    {
      name: 'Home Depot',
      url: 'https://www.homedepot.com/s/2x4',
      description: 'Tests Home Depot access'
    },
    {
      name: "Lowe's",
      url: 'https://www.lowes.com/search?searchTerm=2x4',
      description: "Tests Lowe's access"
    }
  ];

  // Run tests
  for (const test of testUrls) {
    console.log(`\nTesting: ${test.name}`);
    console.log(`URL: ${test.url}`);
    console.log(`Description: ${test.description}`);
    
    try {
      const startTime = Date.now();
      const response = await axios.get(test.url, testConfig);
      const duration = Date.now() - startTime;
      
      console.log(`✅ SUCCESS`);
      console.log(`Response time: ${duration}ms`);
      console.log(`Status: ${response.status}`);
      
      if (test.url.includes('myip.json')) {
        console.log(`Exit IP: ${response.data.ip}`);
        console.log(`Country: ${response.data.country}`);
        console.log(`ASN: ${response.data.asn.name}`);
      } else {
        console.log(`Content length: ${response.data.length} bytes`);
        
        // Check if we got real content
        if (response.data.includes('2x4') || response.data.includes('lumber')) {
          console.log(`✅ Found product content`);
        }
      }
      
    } catch (error) {
      console.log(`❌ FAILED`);
      console.log(`Error: ${error.message}`);
      
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
      }
      
      if (error.code === 'ECONNREFUSED') {
        console.log('Connection refused - check proxy settings');
      } else if (error.code === 'ETIMEDOUT') {
        console.log('Connection timeout - proxy may be slow');
      } else if (error.response?.status === 407) {
        console.log('Proxy authentication failed - check credentials');
      }
    }
  }
  
  console.log('\n\n=== Configuration Info ===');
  console.log(`Proxy Host: ${testConfig.proxy.host}`);
  console.log(`Proxy Port: ${testConfig.proxy.port}`);
  console.log(`Username format: brd-customer-hl_[YOUR_ID]-zone-[ZONE_NAME]`);
  console.log(`\nMake sure to update your .env file with:`);
  console.log(`BRIGHT_DATA_USERNAME=your-actual-username`);
  console.log(`BRIGHT_DATA_PASSWORD=your-actual-password`);
}

// Run the test
testBrightDataConnection().catch(console.error);
