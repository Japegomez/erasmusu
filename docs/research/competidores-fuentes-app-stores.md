# Competitive research: drinking-water fountain finder apps

**Date researched:** 2026-09-14  
**Scope:** Google Play Store, Apple App Store, official product sites, municipal portals, OpenStreetMap tagging docs.  
**Purpose:** Inventory of apps similar to a “nearest drinking water fountain finder,” with coverage relevance for Rome, Barcelona, Madrid, Bilbao, and differentiation vs planned Erasmusu positioning.

**Method notes**
- Prefer primary store listings and first-party sites over blog roundups.
- Ratings, review counts, and “last updated” reflect what was visible on listing pages on the research date; store UIs vary by locale and change frequently.
- Gaps are called out explicitly when a claim could not be verified on a store page.

---

## Executive summary

1. **The category is crowded.** Multiple free/IAP apps already ship “nearest fountain on a map” using OpenStreetMap (OSM) and/or municipal open data: Fountain Finder, Water Finder (Mario Nachbaur / AguApp), Water Finder – Refill Map (Daniel Nohr), Water Mapper, Drinking Water Map, Watrify, Droply, Tap (findtap), AquaFinder, plus OsmAnd POI overlays.
2. **Launch cities are not empty.** Rome has dedicated *nasoni* apps; Barcelona has official **Fonts BCN**; Madrid has official **Madrid Móvil** fountain status plus a separate **Fuentes de Madrid** iOS app and a municipal geoportal. **Bilbao has no dedicated fountain-finder app found** on the stores; municipal GeoBilbao exists as a web geoportal, not a fountain-specialist mobile app.
3. **Most competitors are thin OSM wrappers.** Shared weaknesses in reviews: sparse coverage outside well-mapped cities, ornamental vs potable confusion, missing photos/directions, ads covering the map, and little trust in “last checked” without provenance.
4. **Differentiation that is *already claimed* by others:** global OSM map, nearest pin + directions, photos, favorites, GPX route water, restrooms, ad-free privacy-first (Watrify), hiking/offline (Droply), municipal official status (Fonts BCN / Madrid Móvil).
5. **Differentiation still relatively open vs store copy:** potable-only import that discards ornamentals; presence-gated (~150 m) community signals; AI photo review; explicit trust/asymmetry rules; Erasmus/budget-newcomer GTM with **ES / CA / EU / IT / EN**; multi-city Spain+Rome product (not single-city municipal).
6. **Main risk:** shipping “yet another OSM fountain map” collides with many low-engagement apps and free power-user alternatives (OsmAnd). Undifferentiated launch will compete on ASO keywords against Fountain Finder / Water Finder / Watrify without a clear reason to switch.

---

## OSM data model (relevant to “potable-only” claims)

Primary tagging docs:

| Concept | Tagging | Source |
|--------|---------|--------|
| Dedicated drinking water | `amenity=drinking_water` | [OSM Wiki: amenity=drinking_water](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Ddrinking_water) |
| Potability on other features | `drinking_water=yes/no` (e.a.) on toilets, wells, springs, **decorative** `amenity=fountain`, etc. | [OSM Wiki: Key:drinking_water](https://wiki.openstreetmap.org/wiki/Key:drinking_water) |
| Decorative / cultural fountain | `amenity=fountain` (not necessarily potable) | Same wiki pages; fountain subtypes via `fountain=*` ([Key:fountain](https://wiki.openstreetmap.org/wiki/Key:fountain)) |

**Implication for Erasmusu:** Store competitors that import all `amenity=fountain` without `drinking_water=yes` will show ornamentals. A hard potable-only filter is a documented OSM-aligned differentiator—but only if product UX communicates why pins are fewer than rival maps.

---

## Competitive inventory

### A. Global / multi-city dedicated fountain apps

#### 1. Fountain Finder
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | iOS (iPhone; Mac/Vision listed). **No Android listing found under this name.** | [App Store](https://apps.apple.com/us/app/fountain-finder/id1515767527) |
| Monetization | Free + IAP **Pro $4.99** | Same |
| Data | Not explicitly named OSM on store page; claims **230,000+** drinking fountains; cities named include **Barcelona**, Florence, Paris, London, NYC, Zürich, etc. | Same |
| Coverage | Worldwide (marketing); Barcelona explicitly listed | Same |
| Key features | Map, nearby, directions; Pro walking routes on map; historical fountains with reported drinkable water | Same (description + version notes) |
| Ratings | ~**4.3 / 5**, **9 ratings** (US listing observed) | Same |
| Last update | Version **3.2** notes dated **Aug 11** (year from copyright © 2026) | Same |
| Languages | EN, NL, FR, DE, **IT** — **not ES/CA/EU** | Same |
| Strengths | Clean travel positioning; Barcelona named; Italian supported; actively updated (2026) | Same |
| Weaknesses | Tiny review volume; NA review: shows &lt;50% of known fountains; iOS-only | Reviews on same listing |
| Spain/Italy relevance | Barcelona named; Florence named; no Madrid/Bilbao/Rome callouts on store text | Same |

#### 2. Water Finder — Find Fountains (Mario Nachbaur; formerly AguApp)
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | **Android + iOS** | [Play](https://play.google.com/store/apps/details?id=mn.openlocations&hl=en), [App Store](https://apps.apple.com/by/app/water-finder-find-fountains/id6447196147), [waterfinder.org](https://waterfinder.org/) |
| Monetization | Free; Play: reviews mention **ads**; iOS: **Premium** IAP (~USD 3.99–4.99), “Contains Advertising” | Play + App Store listings |
| Data | **OpenStreetMap**; open source; photos from Wikimedia / Panoramax per release notes | [waterfinder.org](https://waterfinder.org/), App Store release notes |
| Coverage | Global wherever OSM has amenities; also **restrooms** | Same |
| Key features | Map, accessibility, bottle-fill, fee, inspection dates, photos, out-of-order signals, comments | Store descriptions |
| Ratings | Android **~3.0 / 5**, **~104–106 reviews** | [Play](https://play.google.com/store/apps/details?id=mn.openlocations&hl=en) |
| iOS ratings | “Not enough ratings” on BY listing | [App Store](https://apps.apple.com/by/app/water-finder-find-fountains/id6447196147) |
| Last update | Play: **Jul 9, 2026**; iOS 2.3.10 noted **2 Jul** | Same |
| Languages | EN, ES, DE (+ FR/IT/pt-BR mentioned in Play “What’s new”) | Listings |
| Developer | Mario Nachbaur Riscos — **Spain** listed on Play | Play |
| Strengths | True cross-platform OSM app; Spanish; Spain-based indie; transparent OSM attribution | Primary sites |
| Weaknesses | Mediocre Android rating; reviews: ads cover map, must zoom to see pins, sparse local data, contribution friction | Play reviews |
| Spain/Italy relevance | High for Spain (ES + Spanish developer); Italy via OSM density, not city-specific product | — |

#### 3. Water Finder – Refill Map / Water Finder: Refill Station (Daniel Nohr; App Store id **6761177435**)
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | **iOS**; Android **not verified** on Play under this brand | [App Store (US)](https://apps.apple.com/us/app/water-finder-refill-station/id6761177435), [App Store (TM)](https://apps.apple.com/tm/app/water-finder-refill-map/id6761177435) |
| Monetization | Free + ads + IAP **Premium USD 7.99**; privacy labels include tracking for ads | Same |
| Data | **OpenStreetMap**; claims **350,000+** fountains worldwide | Same |
| Coverage | Global search-any-city | Same |
| Key features | Nearest + distance, bottle/seasonal/fee/wheelchair details, Maps navigation, report broken, add fountain, satellite view | Same |
| Ratings | “Not enough ratings” | TM listing |
| Last update | Version **1.3** **18 Aug** (recent; first release notes from Mar) | Same |
| Languages | EN + DA/FR/DE/**IT**/JA/KO/PT/ZH/**ES** | Same |
| Strengths | Closest feature clone to “nearest CTA + OSM details”; ES/IT; report/add flows | Same |
| Weaknesses | New/low social proof; ad+tracking heavy; name collides with Nachbaur’s Water Finder | Same |
| Spain/Italy | Languages support ES/IT; no city-specific claims verified | Same |

> **Name collision:** Two distinct products use “Water Finder.” Always disambiguate by developer (Nachbaur vs Nohr) and store id.

#### 4. Water Mapper – Waterfountains
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | **iOS**; Android **not verified** on Play for this product | [App Store](https://apps.apple.com/us/app/water-mapper-waterfountains/id6615082302), [watermapper.app](https://watermapper.app/) |
| Monetization | Free (no IAP called out on listing) | App Store |
| Data | “Multiple data sources”; on-device location validation | [watermapper.app](https://watermapper.app/) |
| Coverage | Global; release notes add cities including **Málaga (Spain)** | App Store “What’s New” |
| Key features | Distance, navigation, opening times/status/descriptions; extra sources in selected countries | Same |
| Ratings | **5.0 / 5**, **1 rating** (US) | Same |
| Last update | **4.5.0 Jun 13** | Same |
| Languages | EN + 11 incl. **ES** (not CA/EU/IT listed) | Same |
| Strengths | Multi-source claim; Spanish; Málaga support shows Spain interest | Same |
| Weaknesses | Tiny ratings; iOS-only (as verified); not a community trust system | Same |

#### 5. Watrify – Drinking fountains
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | **Android + iOS** | [Play `com.watrify.app`](https://play.google.com/store/apps/details?id=com.watrify.app&hl=en), [App Store](https://apps.apple.com/us/app/watrify-drinking-fountains/id6754257077), [watrify.org](https://www.watrify.org/drinking-water-app/) |
| Monetization | **Free, ad-free, no IAP**, volunteer-run, no tracking (store + site claims) | Same |
| Data | Official open data + community + **OSM**; **250,000+** Europe | Same |
| Coverage | **Europe-focused** (not global marketing) | Same |
| Key features | Map, favorites, photos, comments, ratings, data-source filter (Android), GPX along route, restrooms, push near favorites | Same |
| Ratings | iOS **5.0 / 1 rating**; Play rating **not shown** on fetched page | Listings |
| Last update | Play **Aug 30, 2026**; iOS very recent (version 4.5 “2d ago” on fetch) | Same |
| Languages | Store: EN, FR, DE, **IT**, **ES**; site FAQ still says DE/EN in one place (inconsistency) | App Store vs [watrify.org FAQ](https://www.watrify.org/drinking-water-app/) |
| Strengths | Closest **European** competitor; privacy/ad-free; municipal+OSM hybrid; ES/IT; photos+comments | Primary |
| Weaknesses | Not CA/EU; low App Store social proof; Europe-only vs global travelers; volunteer single-dev sustainability | Same |
| Spain/Italy | High (Europe map + ES/IT). **City-level density for Madrid/Barcelona/Rome/Bilbao not independently audited in this research.** | Gap |

> **Caution:** Play also has unrelated “Watrify - Water Delivery App” (`com.watrify.watrify_consumer`). Do not confuse with the fountain map.

#### 6. Droply – find drinking water
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | **iOS** + **Android** (site badges) | [App Store](https://apps.apple.com/us/app/droply-find-drinking-water/id6742996650), [droply-app.com](https://droply-app.com/) → Play `com.droply.app.v1` |
| Monetization | Free map + community; **droply PRO** IAP ($7.99 / lifetime $24.99); ads implied for free tier | App Store |
| Data | Community reports + open map data | Site + store |
| Coverage | Global outdoor + city fountains | Same |
| Key features | Check-ins/flow status, photos, offline/Pro route water planner, GPX, PCT water report | Same |
| Ratings | **5.0 / 2 ratings** | App Store |
| Last update | **2.0.16** “5d ago” (very active) | Same |
| Languages | Listing shows EN; release notes mention FR/IT/ES/PT/PL/SV | Same |
| Strengths | Strongest **live status / presence-style community** among peers; hiking GTM; city mode claimed | Same |
| Weaknesses | Outdoor-first brand may under-index for Erasmus city use; small ratings; Pro paywall for offline/planner | Same |
| Overlap with Erasmusu | Check-ins ≈ community signals, but **not** marketed as presence-gated ~150 m or AI photo review | Inference from store/site |

#### 7. Tap / findtap — “Tap Water Stations & Hydration”
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | iOS + Android | [App Store GB](https://apps.apple.com/gb/app/tap-water-stations-hydration/id1438558026), [Play](https://play.google.com/store/apps/details?id=com.findtap.app&hl=en), [findtap.com](https://findtap.com) |
| Monetization | Free (monetization details **not fully verified** on fetched pages) | Gap |
| Data | Proprietary network claim **250,000+** points / **100+ countries**; UGC add station | Store text |
| Coverage | Global; cities named: LA, NYC, London (not Spain/Italy cities) | Same |
| Key features | Refill map, filters, directions, **hydration tracker**, corporate/sponsor vibe (reviews) | Same + Play reviews (via search snippets) |
| Ratings | **Could not re-fetch full Play ratings** in this session (one fetch returned 404 intermittently) | Gap |
| Strengths | Brand scale claims; hydration tracking differentiator | Store |
| Weaknesses | Reviews historically criticize UX (untappable pins, unclear station types, offline missing); more “refill network” than fountain-first | Play review snippets in search |
| Spain/Italy | Not highlighted in store marketing | Same |

#### 8. Drinking Water Map: Finder App
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | **Android** | [Play](https://play.google.com/store/apps/details?id=gr.alexgeorgiou.drinking_water_map&hl=en_US) |
| Monetization | **Contains ads** + IAP ad-free subscription | Same |
| Data | **OSM** | Same |
| Coverage | Global OSM | Same |
| Key features | Map, filters (bottle, indoor/outdoor, free, wheelchair), open in external maps, remembers last area | Same |
| Ratings | **Not shown** on fetched page snippet | Gap |
| Last update | **Aug 22, 2026** | Same |
| Strengths | Explicit OSM; filterable attributes | Same |
| Weaknesses | Classic ad-supported OSM wrapper; Greek developer, no ES/CA/EU/IT called out | Same |

#### 9. AquaFinder – Find Water Source
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | Android | [Play](https://play.google.com/store/apps/details?id=com.planadev.app.android.aquafinder&hl=en) |
| Monetization | Free (AppBrain secondary: no ads — treat as **unverified** vs Play) | Play; [AppBrain](https://www.appbrain.com/app/aquafinder-find-water-source/com.planadev.app.android.aquafinder) secondary |
| Data | User-verified community + map | Play |
| Ratings | AppBrain secondary: **~2.4 / 5**, ~160 ratings — **not re-confirmed on Play HTML** | Gap / secondary |
| Notes | Campervan/hiking oriented; share via social apps | Play |

#### 10. WeTap Drinking Fountain Finder
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | iOS; site claims Android + desktop | [App Store](https://apps.apple.com/us/app/wetap-drinking-fountain-finder/id903424762), [wetap.org/app](https://www.wetap.org/app) |
| Monetization | Free | App Store |
| Data | Proprietary UGC map; LA / US advocacy focus (2028 Olympics project) | Site |
| Ratings | **3.3 / 5**, **24 ratings** | App Store |
| Last update | **2.0.3 Aug 16, 2024** (stale vs peers) | Same |
| Strengths | Long history; civic advocacy | Same |
| Weaknesses | Older reviews: add-fountain bugs; not EU/Spain GTM; outdated relative to 2026 peers | Reviews + dates |
| Spain/Italy | Not a primary competitor for target cities | — |

#### 11. Refill / Refill Return (City to Sea)
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | Android (listing title **Refill Return**); historically “Refill” | [Play](https://play.google.com/store/apps/details?id=uk.geovation.refill&hl=en), campaign context [refill.org.uk](https://www.refill.org.uk) |
| Monetization | Free (campaign app) | Play |
| Data | Business / station network **300,000+** “Refill Return Stations” — **not** primarily municipal fountains | Play |
| Ratings | **~2.8 / 5**, **~700+ reviews** | Play |
| Last update | **Jun 10, 2026** | Play |
| Strengths | Brand awareness (UK / plastic campaign) | — |
| Weaknesses | Reviews: broken UI, stations don’t load; parks/fountains hard to add; not fountain-first | Play reviews |
| Spain/Italy | Not positioned for ES/IT municipal fountains | — |

---

### B. City-specific / municipal (high relevance to launch cities)

#### 12. Nasoni Roma: Acqua
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | Android | [Play](https://play.google.com/store/apps/details?hl=it&id=com.roma.nasoni) |
| Monetization | Free; privacy: no data collected (developer declaration) | Same |
| Data | Rome-focused; **1,800+** nasoni/fontanelle claim | Same |
| Coverage | **Rome only** | Same |
| Key features | Full-screen map, clustering, GPS, type/name/address, open in Maps; no account | Same |
| Ratings | **Not shown** on fetched Italian page | Gap |
| Last update | **13 Aug 2026** | Same |
| Strengths | Sharp Rome GTM; “nearest nasone” CTA matches Erasmusu job-to-be-done | Same |
| Weaknesses | Single city; no multi-city Erasmus network | Same |

#### 13. I Nasoni di Roma
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | iOS + Android | [App Store IT](https://apps.apple.com/it/app/i-nasoni-di-roma/id415468948), [Play](https://play.google.com/store/apps/details?hl=it&id=com.mdc.nasoniborracce) |
| Monetization | Free (legacy book promo) | App Store |
| Data | Book-derived Rome walls coverage + user add worldwide | Same |
| Ratings | iOS **4.4 / 5**, **18 ratings** | Same |
| Last update | iOS **2.7 Feb 26, 2020** — **stale** | Same |
| Strengths | Historic Rome brand | Same |
| Weaknesses | Very old last update; Books category; English-only on IT listing | Same |

#### 14. Fonts BCN (Ajuntament de Barcelona)
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | Android + iOS | [Play](https://play.google.com/store/apps/details?id=cat.bcn.fontspubliques&hl=en), municipal page [ajuntament.barcelona.cat/apps/en/fonts-bcn](https://ajuntament.barcelona.cat/apps/en/fonts-bcn) |
| Monetization | Free official | Same |
| Data | **Municipal** drinking fountains + artistic/historical fountain info | Same |
| Coverage | **Barcelona only** | Same |
| Languages | **Catalan, Spanish, English** (official page) | Municipal page |
| Ratings | Play **5.0 / ~321 reviews**; municipal page cites ~4.5 / 400 | Play + municipal |
| Last update | Play **Dec 16, 2025** | Play |
| Strengths | Official trust; CA/ES/EN; nearest + map | Same |
| Weaknesses | Reviews: wrong locations, no in-app report, past connectivity bugs; city lock-in | Play reviews |
| vs Erasmusu | Direct Barcelona competitor for “nearest potable fountain”; lacks multi-city + community trust layer | — |

#### 15. Madrid Móvil (Ayuntamiento de Madrid)
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | Android + iOS | [Play](https://play.google.com/store/apps/details?id=es.madrid.SGRSAMVANDCIU&hl=es_US), [App Store ES](https://apps.apple.com/es/app/madrid-m%C3%B3vil/id1309506191) |
| Monetization | Free official mega-app | Same |
| Data | Municipal **fuentes de agua para beber** + status + routing (+ toilets) | Same + [madrid.es fuentes](https://www.madrid.es/portales/munimadrid/es/Inicio/Medio-ambiente/Normativa/Fuentes-de-agua-para-beber/?vgnextchannel=11cf79ed268fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=81c04dabbebad510VgnVCM2000001f4a900aRCRD) |
| Coverage | Madrid city services (fountains are one module) | Same |
| Ratings | Play **3.7 / ~9.6K reviews**, **1M+** downloads | Play |
| Last update | **26 Aug 2026** | Play |
| Strengths | Official daily-updated status (city portal claims daily updates on web viewer) | madrid.es |
| Weaknesses | Fountain UX buried in bureaucracy app; overall app rated mediocre for non-fountain reasons | Play reviews |
| Geoportal | Dataset “Fuentes de agua para beber” | [geoportal.madrid.es](https://geoportal.madrid.es/IDEAM_WBGEOPORTAL/dataset.iam?id=0f15dfeb-13ee-11ee-8066-e0d4648d893e) |

#### 16. Fuentes de Madrid (third-party iOS)
| Field | Finding | Source |
|-------|---------|--------|
| Platforms | iOS | [App Store ES](https://apps.apple.com/es/app/fuentes-de-madrid/id1252996673?l=en-GB) |
| Monetization | Free (details partially fetched) | Search/App Store snippets |
| Features | Locate potable fountains; mark broken/working | Same |
| Ratings / update | **Full page fetch timed out / 409** — treat details as **partially verified** | Gap |
| Note | Exists as a dedicated Madrid fountain app distinct from Madrid Móvil | Listing URL exists |

#### 17. Bilbao
| Field | Finding | Source |
|-------|---------|--------|
| Dedicated fountain app | **None found** on Play/App Store under Bilbao/fuentes/potable queries | Store searches (this research) |
| Municipal map | **GeoBilbao** web geoportal (layers, not a fountain-specialist app) | [geobilbao.eus](https://www.geobilbao.eus/#/viewer), [bilbao.eus opendata apps](https://www.bilbao.eus/opendata/es/aplicaciones/urbanismo-infraestructuras,medio-ambiente,transporte/visualizaci%C3%B3n%20web,web%20bistaratzea) |
| Opportunity | Softest municipal competition among the four launch cities | Inference |

---

### C. Indirect competitors (OSM navigators)

#### 18. OsmAnd (drinking water as POI overlay)
| Field | Finding | Source |
|-------|---------|--------|
| Role | General offline OSM navigator; users enable **Water / drinking water** POI overlays or custom filters | OsmAnd GitHub discussion [issue #16021](https://github.com/osmandapp/OsmAnd/issues/16021); community instructions (secondary Reddit); OSM tagging wiki |
| Strengths | Offline, free tier, global OSM, hikers already installed | — |
| Weaknesses | Not fountain-first UX; tag complexity; not Erasmus-localized | — |
| Threat level | High for power users; lower for “tap nearest fountain” newcomers who won’t configure POI overlays | Product judgment |

Organic Maps / StreetComplete similarly expose OSM drinking water without being category apps (not fully inventoried here).

---

## Coverage matrix: Rome / Barcelona / Madrid / Bilbao

| City | Dedicated / official apps | Global OSM apps likely to show pins | Notes |
|------|---------------------------|-------------------------------------|-------|
| **Rome** | Nasoni Roma: Acqua; I Nasoni di Roma | Fountain Finder (Florence named; Rome density via OSM), Water Finder(s), Watrify, Droply, Water Mapper | Strong local competition + dense OSM culture |
| **Barcelona** | **Fonts BCN** (official, CA/ES/EN) | Fountain Finder **names Barcelona**; Watrify Europe; OSM wrappers | Official app is the incumbent for locals/tourists who search “fonts” |
| **Madrid** | **Madrid Móvil** + geoportal; Fuentes de Madrid (iOS) | OSM wrappers / Watrify | Official status data is a trust moat unless Erasmusu imports municipal feeds |
| **Bilbao** | **No dedicated app found** | OSM wrappers only | Best white-space city for launch narrative |

**Spain / Italy languages:** Few competitors cover **CA** or **EU**. Closest language sets: Fonts BCN (CA/ES/EN, BCN-only); Watrify & Water Finder Refill (ES/IT/EN); Nachbaur Water Finder (ES/EN). **Euskera (EU) is effectively open ASO space.**

---

## Feature comparison vs planned Erasmusu positioning

| Planned Erasmusu feature | Who already ships something similar | Gap / openness |
|--------------------------|-------------------------------------|----------------|
| Native cross-platform | Water Finder (Nachbaur), Watrify, Droply, Tap, Fonts BCN, Madrid Móvil | Crowded |
| Cities: Rome, BCN, Madrid, Bilbao first | City apps split the set; no peer owns all four as a product | **Open** as a *portfolio* |
| Erasmus / budget newcomers GTM | Mostly eco/hiking/civic — not Erasmus | **Open** positioning |
| Nearest fountain CTA | Nearly everyone | Commodity |
| OSM potable-only (discard ornamentals) | Rarely stated explicitly; many show generic fountains | **Open** if executed & explained |
| UGC photo + AI photo review | Photos: Watrify, Droply, Water Finder; **AI review: not found** | **Open** |
| Presence-gated signals ~150 m | Droply check-ins (not distance-gated in marketing); none claim ~150 m gate | **Open** |
| Trust / asymmetry rules | Mostly absent beyond “last report” | **Open** |
| Ads 1/3 nearest taps + IAP remove ads + favorites/folders | Ads+IAP common (Drinking Water Map, Nohr Water Finder, Droply Pro, Fountain Finder Pro); folders rare | Partial commodity |
| Languages ES/CA/EU/IT/EN | No single competitor verified with **CA+EU+IT+ES+EN** | **Open** |

---

## Differentiation opportunities (recommended framing)

1. **Multi-city Southern Europe “student & newcomer” hydration**, not another global OSM viewer — win on Rome+Spain corridor with Erasmus distribution (universities, WhatsApp groups, Erasmus Student Network), while municipal apps stay city-siloed.
2. **Potable-only truth layer:** publish filter rules (`amenity=drinking_water` OR `drinking_water=yes`; exclude decorative `amenity=fountain` without potability). Cite OSM wiki in Help. Competitors that show Trevi-like ornamentals create false positives Erasmusu can avoid.
3. **Presence-gated community** (~150 m) + **AI photo review** as anti-spam / anti-remote-troll stack — Droply has check-ins but not this combo; Watrify allows remote-ish UGC without presence marketing.
4. **Trust / asymmetry rules** as product copy (“you can warn everyone after one visit; praise needs more”) — empty niche in store descriptions.
5. **Language moat:** ship **Catalan + Euskera** seriously (not token). Fonts BCN owns CA only inside Barcelona; EU is nearly free.
6. **Municipal hybrid in Madrid/Barcelona:** optionally ingest official feeds (Madrid geoportal / Fonts BCN data where license allows) *plus* OSM for Bilbao/Rome gaps — Watrify already markets this hybrid for Europe; Erasmusu can go deeper on the four cities.
7. **Bilbao as proof of white space:** lead with “first dedicated fountain app experience for Bilbao newcomers” while still covering the other three.

---

## Risks of undifferentiated “yet another OSM fountain map”

1. **ASO collision** with Fountain Finder, Water Finder (×2), Drinking Water Map, Watrify — users cannot distinguish screenshots that are all pin maps.
2. **Review trap:** OSM sparsity in poorly mapped neighborhoods → 1-star “no fountains” (already visible on Nachbaur Water Finder and Fonts BCN location complaints).
3. **Incumbent trust:** Madrid/Barcelona officials already provide status apps; a third-party OSM-only map looks less authoritative unless it adds live community trust or municipal import.
4. **Free alternatives:** OsmAnd / Organic Maps for users who already know OSM.
5. **Privacy-first free rivals (Watrify)** undercut ad-supported models if Erasmusu’s ads feel worse than the utility.
6. **Name confusion** if marketing says “water finder” generically — two App Store products already own that phrase.
7. **Retention:** nearest-fountain is a low-frequency utility; without community loops (presence signals, folders for daily commute, Erasmus social), churn will match other wrappers.

---

## Verification gaps (honest)

| Item | Status |
|------|--------|
| Fountain Finder Android twin | Not found |
| Water Mapper / Nohr Water Finder Android | Not verified on Play |
| findtap full Play ratings / last update | Intermittent fetch failures |
| Fuentes de Madrid full App Store metadata | Fetch timeout / 409 |
| OSM Wiki amenity=drinking_water full page | One fetch timed out; Key:drinking_water & prior search confirm tagging model |
| Live pin counts in Rome/BCN/Madrid/Bilbao inside each app | **Not audited in-app** (would need device installs / Overpass samples) |
| Droply Play ratings | Site confirms Play link; ratings not pulled |
| WeTap Android store listing | Site claims Android; store page not pulled this run |
| Bilbao municipal fountain open dataset | GeoBilbao exists; dedicated fountain layer/app **not confirmed** |
| Exact IAP price localization / ad frequency for all apps | Partial |

---

## Sources index (primary)

- [Fountain Finder – App Store](https://apps.apple.com/us/app/fountain-finder/id1515767527)
- [Water Finder (Nachbaur) – Play](https://play.google.com/store/apps/details?id=mn.openlocations&hl=en)
- [Water Finder (Nachbaur) – App Store](https://apps.apple.com/by/app/water-finder-find-fountains/id6447196147)
- [waterfinder.org](https://waterfinder.org/)
- [Water Finder Refill Map – App Store id 6761177435](https://apps.apple.com/us/app/water-finder-refill-station/id6761177435)
- [Water Mapper – App Store](https://apps.apple.com/us/app/water-mapper-waterfountains/id6615082302)
- [watermapper.app](https://watermapper.app/)
- [Watrify – App Store](https://apps.apple.com/us/app/watrify-drinking-fountains/id6754257077)
- [Watrify – Play](https://play.google.com/store/apps/details?id=com.watrify.app&hl=en)
- [watrify.org drinking-water-app](https://www.watrify.org/drinking-water-app/)
- [Droply – App Store](https://apps.apple.com/us/app/droply-find-drinking-water/id6742996650)
- [droply-app.com](https://droply-app.com/)
- [Tap – App Store](https://apps.apple.com/gb/app/tap-water-stations-hydration/id1438558026)
- [Tap – Play](https://play.google.com/store/apps/details?id=com.findtap.app&hl=en)
- [Drinking Water Map – Play](https://play.google.com/store/apps/details?id=gr.alexgeorgiou.drinking_water_map&hl=en_US)
- [AquaFinder – Play](https://play.google.com/store/apps/details?id=com.planadev.app.android.aquafinder&hl=en)
- [WeTap – App Store](https://apps.apple.com/us/app/wetap-drinking-fountain-finder/id903424762)
- [wetap.org/app](https://www.wetap.org/app)
- [Refill Return – Play](https://play.google.com/store/apps/details?id=uk.geovation.refill&hl=en)
- [Nasoni Roma: Acqua – Play](https://play.google.com/store/apps/details?hl=it&id=com.roma.nasoni)
- [I Nasoni di Roma – App Store](https://apps.apple.com/it/app/i-nasoni-di-roma/id415468948)
- [Fonts BCN – Play](https://play.google.com/store/apps/details?id=cat.bcn.fontspubliques&hl=en)
- [Fonts BCN – Ajuntament](https://ajuntament.barcelona.cat/apps/en/fonts-bcn)
- [Madrid Móvil – Play](https://play.google.com/store/apps/details?id=es.madrid.SGRSAMVANDCIU&hl=es_US)
- [Madrid Móvil – App Store](https://apps.apple.com/es/app/madrid-m%C3%B3vil/id1309506191)
- [Madrid fuentes – ayuntamiento](https://www.madrid.es/portales/munimadrid/es/Inicio/Medio-ambiente/Normativa/Fuentes-de-agua-para-beber/?vgnextchannel=11cf79ed268fe410VgnVCM1000000b205a0aRCRD&vgnextfmt=default&vgnextoid=81c04dabbebad510VgnVCM2000001f4a900aRCRD)
- [Madrid geoportal fuentes dataset](https://geoportal.madrid.es/IDEAM_WBGEOPORTAL/dataset.iam?id=0f15dfeb-13ee-11ee-8066-e0d4648d893e)
- [Fuentes de Madrid – App Store](https://apps.apple.com/es/app/fuentes-de-madrid/id1252996673)
- [GeoBilbao](https://www.geobilbao.eus/#/viewer)
- [OSM Wiki drinking_water key](https://wiki.openstreetmap.org/wiki/Key:drinking_water)
- [OSM Wiki amenity=drinking_water](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Ddrinking_water)
- [OSM Wiki Key:fountain](https://wiki.openstreetmap.org/wiki/Key:fountain)

---

*End of research note.*
