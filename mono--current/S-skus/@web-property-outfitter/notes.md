TODO escape the generated HTML!!!

---

naming session: regarding a web property (ex. a website or a domain) how would you call a tool that can:

- generate scaffolding code for such a web property
- generate settings for the hosting solution
- generate associated files such as .well-known and social previews
- generate a linktree
- maybe manage a release pipeline such as staging/prod or blue/green
- seamlessly able to add features to the web property (like google tag manager)

---

A few directions to pick from, depending on the vibe you want:

**Property/real-estate metaphor** (fits "web property" directly)

- **Estate** — end-to-end management of the whole holding
- **Steward** or **Custodian** — leans into the "takes care of everything" framing
- **Plot** — a piece of web land you develop and maintain
- **Marquee** — the storefront/display angle (good if the linktree and social previews are marquee-level features)

**Builder/maker metaphor** (fits the scaffolding + feature-adding)

- **Webwright** — like shipwright/playwright; someone who crafts the whole thing
- **Sitesmith** — forges the site and everything around it
- **Foundry** or **Forge** — where the property gets cast, configured, and shipped
- **Loom** — weaves together code, config, .well-known, analytics

**Launch/operations metaphor** (fits the pipeline + release management)

- **Rigging** — sets up the ship and keeps it sailing (scaffold + deploy + adjust)
- **Harbor** — where properties dock, get provisioned, and launch
- **Launchpad** — obvious but clear
- **Beacon** — signals presence; fits linktree + social previews

**My top three if I had to commit**

1. **Webwright** — covers building, crafting, and ongoing work; feels like a role, which matches a tool that does many
   things for one property
2. **Sitesmith** — same energy, more blue-collar/workshop feel, easier to pitch
3. **Estate** — the most honest to your framing ("web property"), and naturally covers scaffolding, upkeep, features,
   and releases as different aspects of managing the estate

If the tool is going to grow into a suite (CLI + dashboard + pipeline runner), I'd lean **Estate** — it scales as a
brand (Estate Deploy, Estate Scaffold, Estate Manifest) and the real-estate metaphor already carries concepts like
"tenants," "zoning," "groundskeeping" that map cleanly to features you'll add later.

---

This tool wouldn't take care of everything, it assumes the core code is done by someone else and merely "wraps" /
"enhance" / "productionize" it.

## if we keep the "web property" or "web estate" part in the name, it could be a "web property ..." ?

That constraint really helps — you're looking for the layer that comes _after_ the building. In real estate, that's a
recognized role with its own vocabulary, and several of those words map well:

**Web Property Outfitter** — probably my top pick. An outfitter equips someone or something with what it needs (gear,
fixtures, accessories). Maps cleanly to wrapping core code with .well-known, social previews, linktree, GTM, pipelines.
Doesn't claim to build — it kits out what's already there.

**Web Property Fit-out** / **Fitter** — "fit-out" is the real-estate industry term for all the work between
shell-complete and move-in ready (interiors, wiring, fixtures, finishes). Extremely accurate to what you're describing.
A little clunky as a spoken name, but very precise.

**Web Property Concierge** — captures the "handles all the surrounding service work on your behalf" angle. Good if you
want a hospitality/white-glove vibe.

**Web Property Steward** — ongoing tending without ownership; fits because the tool keeps the property healthy
(releases, feature toggles) over time.

**Web Property Contractor** — hired specialist who comes in after the shell is up to do specific finish work. Matches
"core code done by someone else" almost literally.

**Web Property Foreman** — oversees the ongoing site: who deploys when (blue/green), what goes to staging vs. prod.
Leans more toward the pipeline side than the scaffolding side.

**Web Property Groundskeeper** — ongoing maintenance, infrastructure-adjacent, unglamorous but reliable.

If I had to rank them for your description:

1. **Outfitter** — best fit for "wraps / enhances / productionizes" across the whole feature list
2. **Fit-out** — most technically accurate, slightly awkward name
3. **Contractor** — best fit for the "someone else built the core" constraint
4. **Concierge** — best if you want the brand to feel premium/service-oriented

**Outfitter** also stretches nicely into product vocabulary: "outfit a property with GTM," "the staging outfit," "outfit
config," "outfitter pipeline." That versatility is usually what tips a name from good to great.
