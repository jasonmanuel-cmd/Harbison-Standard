import {
  CONSENT_TEXT,
  HONEYPOT_FIELD,
  SITUATION_OPTIONS,
  TIME_TRAP_FIELD,
  TIMELINE_OPTIONS,
} from "@/lib/situations";

const GROUPS = ["Sell", "Build", "Land"] as const;

/**
 * Shared lead-capture form (§7.2). Ships as a plain
 * `<form method="POST" action="/api/leads">` that works end-to-end with
 * JavaScript disabled (submits, server redirects to /thank-you). The
 * inline script below is pure progressive enhancement: it fills in the
 * time-trap and UTM hidden fields (unavailable to a no-JS submission —
 * the route handler treats a missing opened_at as "unknown," never as a
 * spam signal, see DECISIONS.md) and, when present, intercepts submit to
 * show an inline success message instead of a full navigation.
 */
export function LeadForm({
  source,
  defaultSituation,
  heading = "Get a number on your property",
  subcopy = "Tell me about the property. I’ll call you back — no obligation.",
}: {
  source: "home" | "sell" | "build" | "land" | "press";
  defaultSituation?: string;
  heading?: string;
  subcopy?: string;
}) {
  return (
    <div id="lead-form" className="bg-parchment px-6 py-16">
      <div className="mx-auto max-w-xl">
        <h2 className="font-serif text-3xl text-navy">{heading}</h2>
        <p className="mt-2 text-navy/70">{subcopy}</p>

        <form
          method="POST"
          action="/api/leads"
          data-lead-form
          className="mt-8 space-y-5"
        >
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name={TIME_TRAP_FIELD} value="" data-opened-at />
          <input type="hidden" name="utm_source" value="" data-utm="utm_source" />
          <input type="hidden" name="utm_medium" value="" data-utm="utm_medium" />
          <input type="hidden" name="utm_campaign" value="" data-utm="utm_campaign" />

          {/* Honeypot — real users never see or fill this. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="company">Leave this field blank</label>
            <input
              type="text"
              id="company"
              name={HONEYPOT_FIELD}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-navy">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-navy">
                Phone <span className="text-xs font-normal text-navy/60">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-navy">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
              />
            </div>
          </div>

          <div>
            <label htmlFor="property_address" className="block text-sm font-semibold text-navy">
              Property address
            </label>
            <input
              type="text"
              id="property_address"
              name="property_address"
              required
              className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="situation" className="block text-sm font-semibold text-navy">
                Situation
              </label>
              <select
                id="situation"
                name="situation"
                required
                defaultValue={defaultSituation ?? ""}
                className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
              >
                <option value="" disabled>
                  Select one
                </option>
                {GROUPS.map((group) => (
                  <optgroup key={group} label={group}>
                    {SITUATION_OPTIONS.filter((o) => o.group === group).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="timeline" className="block text-sm font-semibold text-navy">
                Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                defaultValue=""
                className="mt-1 w-full border border-navy/30 bg-white px-4 py-3 text-navy"
              >
                <option value="" disabled>
                  Select one
                </option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              required
              value="1"
              className="mt-1 h-4 w-4 shrink-0"
            />
            <label htmlFor="consent" className="text-sm text-navy/80">
              {CONSENT_TEXT}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-brass px-6 py-3 text-sm font-semibold uppercase tracking-wide text-navy-deep hover:bg-brass/90"
          >
            Send it
          </button>

          <p className="text-center text-xs text-navy/60">
            No spam. No obligation. I will only use this to call or email you back.
          </p>

          <p data-form-status role="status" className="hidden text-sm" />
        </form>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  var container = document.getElementById('lead-form');
  if (!container) return;
  var form = container.querySelector('form[data-lead-form]');
  if (!form) return;

  var openedAt = form.querySelector('[data-opened-at]');
  if (openedAt) openedAt.value = String(Date.now());

  try {
    var params = new URLSearchParams(window.location.search);
    form.querySelectorAll('[data-utm]').forEach(function (el) {
      var key = el.getAttribute('data-utm');
      var val = params.get(key);
      if (val) el.value = val;
    });
  } catch (e) {}

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var status = form.querySelector('[data-form-status]');
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.setAttribute('disabled', 'true');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(function (res) {
        if (res.ok) {
          container.innerHTML =
            '<div class="mx-auto max-w-xl text-center">' +
            '<h2 class="font-serif text-3xl text-navy">Got it.</h2>' +
            '<p class="mt-3 text-navy/80">Thanks — I will call you from the number on this site. If it is urgent, call me directly.</p>' +
            '</div>';
          return;
        }
        return res.json().catch(function () { return {}; }).then(function (body) {
          if (status) {
            status.textContent = body && body.error
              ? body.error
              : 'Something went wrong. Please try again or call directly.';
            status.classList.remove('hidden');
          }
          if (submitBtn) submitBtn.removeAttribute('disabled');
        });
      })
      .catch(function () {
        if (status) {
          status.textContent = 'Network error — please try again or call directly.';
          status.classList.remove('hidden');
        }
        if (submitBtn) submitBtn.removeAttribute('disabled');
      });
  });
})();`,
        }}
      />
    </div>
  );
}
