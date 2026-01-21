import app from '../artisanAlly-backend/server.js';
import connectDB from '../artisanAlly-backend/config/db.js';

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
