import test from 'node:test';
import assert from 'node:assert/strict';
import {clampPDFPage,readerScale,zoomStep,progressToPage,scrollFraction} from '../src/pdf-reader-logic.js';
import {readFileSync} from 'node:fs';
const f=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('PDF page numbers clamp to document bounds',()=>{
 assert.equal(clampPDFPage(-7,50),1);assert.equal(clampPDFPage('4',50),4);
 assert.equal(clampPDFPage(800,50),50);assert.equal(clampPDFPage('bad',0),1);
});
test('PDF fit-width respects available canvas space',()=>{
 assert.equal(readerScale('fit',600,300),.5);assert.equal(readerScale('fit',800,800),1);
 assert.equal(readerScale(1.5,800,600),1.5);assert.equal(readerScale(99,800,600),4);
});
test('PDF zoom controls are bounded and deterministic',()=>{
 assert.equal(zoomStep('fit',1),1.25);assert.equal(zoomStep('fit',-1),.75);
 assert.equal(zoomStep(.4,-1),.4);assert.equal(zoomStep(4,1),4);
});
test('private on-screen PDF renderer uses PDF.js without iframe or external PDF URLs',()=>{
 const src=f('../src/app.js');assert.match(src,/pdfjs\/pdf\.mjs/);assert.match(src,/getDocument\(/);
 assert.match(src,/getViewport\(/);assert.match(src,/canvasContext/);
 assert.doesNotMatch(src,/<iframe class="reader-frame"/);
 assert.match(src,/unsealPDF\(doc,vaultKey\)/);
 const b=f('../scripts/build.mjs');assert.match(b,/pdf\.worker\.mjs/);
 const sw=f('../public/sw.js');assert.match(sw,/vendor\/pdfjs\/pdf\.mjs/);
});

test('fast page scrubber reliably maps finger positions to document pages',()=>{
 assert.equal(progressToPage(0,505),1);assert.equal(progressToPage(1,505),505);
 assert.equal(progressToPage(.5,505),253);assert.equal(progressToPage(-2,505),1);
 assert.equal(progressToPage(8,505),505);assert.equal(progressToPage(NaN,505),1);
 assert.equal(progressToPage(.5,1),1);
 assert.equal(scrollFraction(0,100),0);assert.equal(scrollFraction(60,100),.6);
 assert.equal(scrollFraction(120,100),1);assert.equal(scrollFraction(-10,100),0);
});
test('touch PDF reader renders a lazy continuous scroll and mobile drag rail',()=>{
 const js=f('../src/app.js');const css=f('../src/style.css');
 assert.match(js,/readerMode:'continuous'/);
 assert.match(js,/IntersectionObserver/);assert.match(js,/disposeContinuousView/);
 assert.match(js,/pdf-scrub-track/);assert.match(js,/setPointerCapture/);
 assert.match(js,/scroller\.addEventListener\('scroll'/);
 assert.match(js,/view\.loaded\.delete/);
 assert.match(css,/touch-action:pan-x pan-y/);assert.match(css,/touch-action:none/);
 assert.match(css,/\.pdf-page-stage\.pdf-page-continuous/);
});