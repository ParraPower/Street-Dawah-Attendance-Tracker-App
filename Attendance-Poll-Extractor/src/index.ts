import makeWASocket, { useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import * as fs from 'fs';

async function run() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();

  //const store = makeInMemoryStore({});

//   const sock = makeWASocket({
//     version,
//     auth: state,
//     printQRInTerminal: true,
//     getMessage: async (key) => {
//       return store.loadMessage(key.remoteJid!, key.id!);
//     },
//   });
  
//   store.bind(sock.ev);

//   sock.fetchMessageHistory

//   sock.ev.on('messages.upsert', async ({ messages }) => {
//     for (const msg of messages) {
//       if (msg.message?.pollCreationMessage) {
//         console.log('Poll found:', msg.message.pollCreationMessage.name);
//       }
//     }
//   });
}
