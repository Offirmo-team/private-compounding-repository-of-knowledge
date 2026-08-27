
Important reads:

- https://docs.datadoghq.com/real_user_monitoring/guide/understanding-the-rum-event-hierarchy/
- https://docs.datadoghq.com/standard-attributes?product=browser
- https://docs.datadoghq.com/real_user_monitoring/explorer/search_syntax/
- lib reference https://datadoghq.dev/browser-sdk/interfaces/_datadog_browser-rum.DatadogRum.html

Important tools:

- Debug WebExtension: https://chromewebstore.google.com/detail/datadog-browser-sdk-devel/boceobohkgenpcpogecpjlnmnfbdigda

---

# Concepts

## FE vs. BE

Reminder that some analytics are much more accurately gathered from the backend.

For example:

- number of accounts created in interval X
- balance band distributions at time T

Hence no need to overdo it in the frontend for something the backend can do better.

Also reminder that frontend analytics are impacted by:

- ad blockers
- network losses
- untrusted clients
- …

## Session

Different definitions:

- **Datadog** session = ([ref](https://docs.datadoghq.com/account_management/billing/rum/#how-is-a-session-defined))
  - A session is a user journey on your web or mobile application.
  - A session usually includes multiple page views with their associated telemetry.
  - A session expires after 15 minutes of inactivity, and its duration is limited to 4 hours.
  - After 4 hours, a new session is automatically created.
- **sessionStorage** session = ([ref](https://devdocs.io/dom/window/sessionstorage))
  - for a specific origin, a session corresponds to a tab
  - BUT new tabs “fork” the sessionStorage of their parent
  - so it’s possible to propagate some infos across the “tab tree” which disappears when all tabs are closed
- **App** session =
  - a user logged in

## isOrganic

<aside>
⚠️
isOrganic is NOT mapping employees, it’s more generic (also legal reasons)
</aside>

- we have ~n employees with minimum 1~2 accounts each + test accounts
- we also have e2e test accounts,
- and also abusers / bots

We MUST remove those from the dashboards and analysis, esp. the growth ones.

Rationale:

- employees perfectly know the product, create accounts in 3s and perform all actions correctly = not representative of normal users.
- employees **have** to use the product + full awareness of features etc.
- at least 2 out of 4 1M+ users are CWG
- bots and abusers are not our target

→ Hence adding a `isOrganic` attributes to events.

Currently aggregating multiple heuristics, feel free to suggest more.

<aside>
💡

some code pathes may use “is tainted” to avoid double negations. It is the exact opposite of “is organic” = just a temporary different name for readability

</aside>

### tainted cookie

We set a “tainted” cross-domain cookie to propagate a negative !organic detection to the whole browser profile and automatically “taint” any new account created/used on this profile.

The assumption is if it’s a dev/CWG’s browser, then all product activity on the same browser profile is not organic (user is familiar with the product and don’t have the same activity pattern)

## Actions / Activities

We want to track the “core actions” of a user.

We already have a product concept of “activities”

So let’s define “actions” as a more generic term that includes activities

### Action funnel

We want to track begin/end, errors.

**Proposed action funnel:**

(past participle from the user’s point of view)


1. (optional) `reached`
  1. ex. reached the “earn” tab but didn’t initiate an action yet
  2. ex. reached the register/login form but no action yet
2. (optional) `cued` if shown an optional CTA, ex. empty state, reminder
3. `started` the user initiated the action with intent, ex. summoned the “move” modal
  1. `abandonned` ex. dismissed the modal
  2. (optional) `submitted` ex. if form
  3. (optional) `rejected` = an “expected” error we expect the user to iterate on, ex. form validation, username already taken
  4. `failed` = a final, unwanted error
  5. `succeeded`
  6. (optional) `shared` to social media after success

## Attribution

in term of marketing effectiveness tracking, to whom shall we attribute (at least partially) a visit or/and a conversion?

### assist (WIP)

A user may have heard about PRODUCT several times. Maybe they already visited the website but didn’t create an account yet. Those referrals could count as “assist” (TODO one day)

See:

- https://en.wikipedia.org/wiki/Complex_contagion
