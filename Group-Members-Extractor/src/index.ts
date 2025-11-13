import qrCodeTerminal from 'qrcode-terminal';
import * as dotenv from 'dotenv';
import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } from '@whiskeysockets/baileys';
//import * as fs from 'fs'; 
import P from 'pino';
import { stat } from 'fs';
import { resolve } from 'path';
import { rejects } from 'assert/strict';


const { generate, setErrorLevel } = qrCodeTerminal;

const useCreateWASocket = async () => {

  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();

  return { socket: makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'debug' })
  }) , saveCreds: saveCreds};
}

const runWASocketSetup = async () => {
  return new Promise<ConnectionStateType>(async (resolve) => {
    const { socket, saveCreds } = await useCreateWASocket();

    socket.ev.on('creds.update', saveCreds);

    socket.ev.on('connection.update', (update) => {
      const { qr, connection, lastDisconnect } = update;
      
      if (qr) {
        console.log('📱 Scan this QR code:', qr);
        // Optional: use a QR code generator to display it nicely
        setErrorLevel('L');
        generate(qr, { small: true });
        
      }

      if (connection === 'open') {
        console.log('WhatsApp session successfully linked!');
        resolve(ConnectionStateType.Successful);
      }
    
      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
    
        if (statusCode === DisconnectReason.restartRequired) {
          console.log('🔁 Restart required — reinitializing socket...');
          resolve(ConnectionStateType.Reconnecting); // Recreate the WASocket instance
        } else if (statusCode === DisconnectReason.loggedOut) {
          console.log('🔒 Logged out — clear auth and re-scan QR');
          // Optionally delete auth folder and prompt for QR again

        } else {
          console.log('⚠️ Connection closed — attempting reconnect...');
          resolve(ConnectionStateType.LoggedOut); // Retry for other recoverable errors
        }
      }
    });
  });
} 

enum ConnectionStateType {
  None = 0,
  Successful = 1,
  LoggedOut = 2,
  Reconnecting = 3
}

const connectionLogic = async (runAgain: boolean) : Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    runWASocketSetup().then(async (connectionState) => {
      switch(connectionState) {
        case ConnectionStateType.Successful: 
          resolve();    
        case ConnectionStateType.Reconnecting:
        case ConnectionStateType.LoggedOut:
          if (runAgain) 
            await connectionLogic(false).then(() => resolve()).catch(() => reject());
          else 
            reject(); 
        default:
          break;
      }
    })
    .catch(() => {
      console.log("Unexpected state");
      reject(); 
    })
  })
  
} 

export async function run() {
  
  // Dynamically load based on NODE_ENV or default to .env.local
  dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

  await connectionLogic(true);

  console.log("Done");
}


await run();
