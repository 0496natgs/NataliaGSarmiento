// Footnotes also appear in the right margin beside the text that cites them (after ssp.sh).
// The script copies each footnote next to its number; on narrow screens the CSS hides the margin
// notes and the footnotes at the end of the page do the work.
export const SIDENOTES_JS = `if(!window.__sidenotes){window.__sidenotes=1;
function run(){document.querySelectorAll("article a[data-footnote-ref]").forEach(function(a){
var sup=a.closest("sup");if(!sup||sup.nextElementSibling&&sup.nextElementSibling.classList.contains("sidenote"))return;
var li=document.getElementById((a.getAttribute("href")||"").slice(1));if(!li)return;
var n=document.createElement("span");n.className="sidenote";
var num=document.createElement("span");num.className="sidenote-num";num.textContent=a.textContent;n.appendChild(num);
li.querySelectorAll("p").forEach(function(p){var c=p.cloneNode(true);c.querySelectorAll("[data-footnote-backref]").forEach(function(x){x.remove()});
var s=document.createElement("span");s.innerHTML=c.innerHTML;n.appendChild(s)});
sup.after(n)})}
run();document.addEventListener("nav",run)}`

export function Sidenotes() {
  return null
}
