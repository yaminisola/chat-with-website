import express from 'express';
import { RAGPipeline } from '../pipeline/ragPipeline.js';
import { validateUrls, validateQuery } from '../utils/validation.js';
import { Logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

const pipeline = new RAGPipeline();

app.post('/api/ingest', async (req, res) => {
  try {
    const { urls } = req.body;
    validateUrls(urls);
    
    Logger.info(`Processing ${urls.length} URLs for ingestion`);
    await pipeline.ingestUrls(urls);
    
    Logger.success('URLs ingested successfully');
    res.json({ success: true, message: 'URLs ingested successfully' });
  } catch (error) {
    Logger.error('Ingest error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;
    validateQuery(query);
    
    Logger.info(`Processing query: ${query}`);
    const response = await pipeline.processQuery(query);
    
    Logger.success('Query processed successfully');
    res.json({ success: true, response });
  } catch (error) {
    Logger.error('Query error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export const server = app.listen(3000);
