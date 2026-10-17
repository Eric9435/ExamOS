/** Pure page and zoom calculations for the offline PDF.js renderer. */
export function clampPDFPage(page,total){const n=Math.floor(Number(page));const safe=Number.isFinite(n)&&n>0?n:1;return Math.min(safe,total>0?total:Number.MAX_SAFE_INTEGER)}
export function readerScale(zoom,pageWidth,availableWidth){const numeric=Number(zoom);if(zoom!=="fit"&&Number.isFinite(numeric)&&numeric>0)return Math.max(.35,Math.min(4,numeric));if(!(pageWidth>0)||!(availableWidth>0))return 1;return Math.max(.25,Math.min(2.5,availableWidth/pageWidth))}
export function zoomStep(current,direction){const base=current==='fit'?1:Number(current)||1;return Math.round(Math.max(.4,Math.min(4,base+(direction>0?.25:-.25)))*100)/100}

/** Map a vertical fast-scroll track position onto the nearest PDF page. */
export function progressToPage(fraction,total){
 if(!Number.isFinite(Number(total))||total<=0)return 1;
 const safe=Number.isFinite(Number(fraction))?Math.max(0,Math.min(1,Number(fraction))):0;
 return clampPDFPage(Math.round(safe*(total-1))+1,total);
}
/** Bounded progress for mobile scrolling and the draggable scrub rail. */
export function scrollFraction(scrollTop,maxScroll){
 if(!(maxScroll>0))return 0;
 return Math.max(0,Math.min(1,Number(scrollTop)/maxScroll||0));
}