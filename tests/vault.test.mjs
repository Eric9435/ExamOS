import { test } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import {createVault,unlockVault,sealPDF,unsealPDF} from '../src/vault.js';
const pass='correct very long study vault passphrase';
test('vault derives a working key and verifies passphrase',async()=>{
 const {config}=await createVault(pass,webcrypto);
 assert.ok(await unlockVault(pass,config,webcrypto));
 await assert.rejects(unlockVault('wrong password',config,webcrypto),/Incorrect passphrase/);
 assert.equal('key' in config,false);
});
test('PDF bytes are authenticated and encrypted at rest',async()=>{
 const {config,key}=await createVault(pass,webcrypto);
 const original=new Blob(['%PDF-1.7\nprivate university lecture']);
 const sealed=await sealPDF(original,key,'doc-1',webcrypto);
 assert.notEqual(await sealed.blob.text(),await original.text());
 const back=await unsealPDF({...sealed,id:'doc-1'},await unlockVault(pass,config,webcrypto),webcrypto);
 assert.equal(await back.text(),await original.text());
 await assert.rejects(unsealPDF({...sealed,id:'doc-2'},key,webcrypto),/Could not unlock/);
});
test('tampered PDF ciphertext is rejected',async()=>{
 const {key}=await createVault(pass,webcrypto);
 const doc=await sealPDF(new Blob(['%PDF-1.4']),key,'z',webcrypto);
 const tampered=new Uint8Array(await doc.blob.arrayBuffer());tampered[0]^=1;
 await assert.rejects(unsealPDF({...doc,id:'z',blob:new Blob([tampered])},key,webcrypto),/Could not unlock/);
});