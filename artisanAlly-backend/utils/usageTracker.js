import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USAGE_FILE = path.join(__dirname, '../gemini_usage.json');

export const getGeminiUsage = () => {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = fs.readFileSync(USAGE_FILE, 'utf8');
      return JSON.parse(data).count || 0;
    }
  } catch (error) {
    console.error('Error reading usage file:', error);
  }
  return 0;
};

export const incrementGeminiUsage = () => {
  try {
    const count = getGeminiUsage() + 1;
    fs.writeFileSync(USAGE_FILE, JSON.stringify({ count }), 'utf8');
    return count;
  } catch (error) {
    console.error('Error writing usage file:', error);
    return getGeminiUsage();
  }
};

export const resetGeminiUsage = () => {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify({ count: 0 }), 'utf8');
  } catch (error) {
    console.error('Error resetting usage file:', error);
  }
};
