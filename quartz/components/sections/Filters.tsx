import { Lang, categoryLabel, t } from "./i18n"
import { categoryId, Piece, pieceTags, pieceYear } from "./pieces"

// The filter bar (after ssp.sh/posts): filter by categories or tags, find a tag or a piece, then by
// year. It runs in the page, so it works with the list, the grid and the photo grids alike.
export const FILTER_JS = `if(!window.__fl){window.__fl=1;
function apply(fl){var root=fl.closest(".s-index");var cat=fl.dataset.cat||"",tag=fl.dataset.tag||"",year=fl.dataset.year||"",q=(fl.dataset.q||"").toLowerCase();
var seen={};root.querySelectorAll("[data-piece]").forEach(function(el){
var ok=(!cat||el.dataset.category===cat)&&(!tag||("|"+el.dataset.tags+"|").indexOf("|"+tag+"|")>-1)&&(!year||el.dataset.year===year)&&(!q||(el.dataset.text||"").indexOf(q)>-1);
el.classList.toggle("is-hidden",!ok);if(ok&&el.offsetParent!==null)seen[el.dataset.piece]=1});
root.querySelectorAll(".s-year").forEach(function(g){g.classList.toggle("is-hidden",!g.querySelector("[data-piece]:not(.is-hidden)"))});
var n=Object.keys(seen).length;var c=fl.querySelector(".fl-n");if(c)c.textContent=n;var e=root.querySelector(".s-empty-filter");if(e)e.hidden=n>0;
fl.querySelectorAll(".fl-pill").forEach(function(b){var k=b.dataset.kind,v=b.dataset.val;b.classList.toggle("is-on",(k==="cat"&&v===cat)||(k==="tag"&&v===tag)||(k==="year"&&v===year)||(k==="year"&&!v&&!year));
if(k!=="year")b.hidden=b.dataset.group!==fl.dataset.mode||(!!q&&(b.textContent||"").toLowerCase().indexOf(q)<0)})}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".fl [data-mode],.fl .fl-pill");if(!b)return;var fl=b.closest(".fl");
if(b.dataset.mode){fl.dataset.mode=b.dataset.mode;fl.querySelectorAll("[data-mode]").forEach(function(x){x.classList.toggle("is-on",x===b)});fl.dataset.cat="";fl.dataset.tag=""}
else{var k=b.dataset.kind,v=b.dataset.val||"";if(k==="cat")fl.dataset.cat=fl.dataset.cat===v?"":v;if(k==="tag")fl.dataset.tag=fl.dataset.tag===v?"":v;if(k==="year")fl.dataset.year=v}
apply(fl)});
document.addEventListener("input",function(e){var i=e.target;if(!i.classList||!i.classList.contains("fl-q"))return;var fl=i.closest(".fl");fl.dataset.q=i.value;apply(fl)});
function init(){document.querySelectorAll(".fl").forEach(apply)}init();document.addEventListener("nav",init)}`

/**
 * Filter bar for a section index. `pieces` give the counts. Pieces are hidden or shown through the
 * data attributes the cards, tiles and rows carry (see filterAttrs in pieces.ts).
 */
export function Filters({ pieces, lang }: { pieces: Piece[]; lang: Lang }) {
  const tt = t(lang)
  const count = (items: string[]) => {
    const m = new Map<string, number>()
    for (const i of items) m.set(i, (m.get(i) ?? 0) + 1)
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }
  const cats = count(pieces.map((p) => p.category))
  const tags = count(pieces.flatMap((p) => pieceTags(p)))
  const years = count(pieces.map((p) => pieceYear(p, lang))).sort((a, b) =>
    b[0].localeCompare(a[0]),
  )
  const hasTags = tags.length > 0
  return (
    <div class="fl" data-mode="cats" data-cat="" data-tag="" data-year="" data-q="">
      <div class="fl-row">
        <span class="fl-label">{tt.filterBy}</span>
        <span class="fl-modes">
          <button type="button" data-mode="cats" class="is-on">
            {tt.categories}
          </button>
          {hasTags && (
            <button type="button" data-mode="tags">
              {tt.tags}
            </button>
          )}
        </span>
        <label class="fl-find">
          <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
            <circle
              cx="8.5"
              cy="8.5"
              r="5.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            />
            <path
              d="M13 13l4.5 4.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          <input class="fl-q" type="search" placeholder={tt.findPlaceholder} autocomplete="off" />
        </label>
        <span class="fl-showing">
          {tt.showing} <b class="fl-n">{new Set(pieces.map((p) => p.slug)).size}</b>
        </span>
      </div>
      <div class="fl-pills">
        {cats.map(([c, n]) => (
          <button
            type="button"
            class="fl-pill"
            data-kind="cat"
            data-group="cats"
            data-val={categoryId(c)}
          >
            {categoryLabel(c, lang)}
            <sup>{n}</sup>
          </button>
        ))}
        {tags.map(([c, n]) => (
          <button
            type="button"
            class="fl-pill"
            data-kind="tag"
            data-group="tags"
            data-val={c}
            hidden
          >
            {c}
            <sup>{n}</sup>
          </button>
        ))}
      </div>
      {years.some(([y]) => /^\d{4}$/.test(y)) && (
        <div class="fl-row fl-yearrow">
          <span class="fl-label">{tt.year}</span>
          <div class="fl-pills">
            <button type="button" class="fl-pill is-on" data-kind="year" data-val="">
              {tt.all}
              <sup>{pieces.length}</sup>
            </button>
            {years.map(([y, n]) => (
              <button type="button" class="fl-pill" data-kind="year" data-val={y}>
                {y}
                <sup>{n}</sup>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
