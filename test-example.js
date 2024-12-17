import axios from 'axios';

// Example URLs to ingest
const urls = [
  'https://www.example.com/about',
  'https://www.example.com/products'
];

// Test ingest endpoint
async function testIngest() {
  try {
    const response = await axios.post('http://localhost:3000/api/ingest', {
      urls: urls
    });
    console.log('Ingest Response:', response.data);
  } catch (error) {
    console.error('Ingest Error:', error.message);
  }
}

// Test query endpoint
async function testQuery() {
  try {
    const response = await axios.post('http://localhost:3000/api/query', {
      query: "What products are available?"
    });
    console.log('Query Response:', response.data);
  } catch (error) {
    console.error('Query Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Testing RAG Pipeline...\n');
  
  console.log('1. Ingesting URLs...');
  await testIngest();
  
  console.log('\n2. Querying the system...');
  await testQuery();
}

runTests();
