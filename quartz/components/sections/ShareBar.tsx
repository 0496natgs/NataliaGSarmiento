import { Lang, t } from "./i18n"

// One click handler for every share button on every page (the page changes without a reload).
// The share links are plain https links: nothing is loaded from the networks and nothing is tracked.
const SHARE_JS = `if(!window.__share){window.__share=1;
function show(){document.querySelectorAll(".share-native").forEach(function(b){if(navigator.share)b.hidden=false})}
show();document.addEventListener("nav",show);
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-share]");if(!b)return;var box=b.closest(".share"),url=box.getAttribute("data-url"),title=box.getAttribute("data-title");
if(b.getAttribute("data-share")==="native"){navigator.share({title:title,url:url}).catch(function(){})}
else if(b.getAttribute("data-share")==="copy"){var done=function(){var o=b.textContent;b.textContent=b.getAttribute("data-done");setTimeout(function(){b.textContent=o},1600)};
if(navigator.clipboard)navigator.clipboard.writeText(url).then(done);else{var t=document.createElement("textarea");t.value=url;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();done()}}})}`

/** Share this page: the phone's own share sheet where there is one, copy link, and a few networks. */
export function ShareBar({ url, title, lang = "en" }: { url: string; title: string; lang?: Lang }) {
  const tt = t(lang)
  const u = encodeURIComponent(url)
  const ti = encodeURIComponent(title)
  const links = [
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ["X", `https://twitter.com/intent/tweet?url=${u}&text=${ti}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ["WhatsApp", `https://wa.me/?text=${ti}%20${u}`],
    ["Email", `mailto:?subject=${ti}&body=${u}`],
  ]
  return (
    <div class="share" data-url={url} data-title={title}>
      <script dangerouslySetInnerHTML={{ __html: SHARE_JS }} />
      <span class="share-label">{tt.share}</span>
      <button type="button" class="share-btn share-native" data-share="native" hidden>
        {tt.shareNative}
      </button>
      {links.map(([label, href]) => (
        <a
          class="share-btn"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-router-ignore
        >
          {label}
        </a>
      ))}
      <button type="button" class="share-btn" data-share="copy" data-done={tt.copied}>
        {tt.copyLink}
      </button>
    </div>
  )
}
