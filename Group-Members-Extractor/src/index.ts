import * as dotenv from 'dotenv';
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
//import * as fs from 'fs';


async function run() {

// Dynamically load based on NODE_ENV or default to .env.local
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();
}

run();