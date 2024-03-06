import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

export default new Client({ auth: process.env.NOTION_KEY });
