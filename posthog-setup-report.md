<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the DevEvent Next.js App Router application.

## Summary of changes

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the recommended `instrumentation-client` pattern for Next.js 15.3+. Configured with a reverse proxy path (`/ingest`), exception capturing enabled, and debug mode in development.
- **`next.config.ts`**: Added PostHog reverse proxy rewrites for `/ingest/static/:path*` and `/ingest/:path*`, plus `skipTrailingSlashRedirect: true`. This improves reliability by routing PostHog requests through your own domain, reducing interception by ad blockers.
- **`.env.local`**: Added `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables. The PostHog key is referenced via env vars in all code files — never hardcoded.
- **`components/ExploreBtn.tsx`**: Added `posthog.capture('explore_events_clicked')` in the existing click handler.
- **`components/EventCard.tsx`**: Added `'use client'` directive and `posthog.capture('event_card_clicked', { event_title, event_slug, event_location, event_date })` on card click, capturing which event the user selected.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicked the "Explore events" button to scroll to the events list | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card; includes title, slug, location, and date properties | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/339488/dashboard/1352900
- **Insight — User engagement over time** (daily trend of both events): https://us.posthog.com/project/339488/insights/hhWkbgsB
- **Insight — Event discovery funnel** (explore → click conversion): https://us.posthog.com/project/339488/insights/DRa1Znll
- **Insight — Most clicked events** (breakdown by event title): https://us.posthog.com/project/339488/insights/rVEfcsPg

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
