# Scorekeeper

An unncessary scorekeeping app for retired people.

## Deployment

https://scorekeeper-gold.vercel.app/

## Local Development

```
pnpm install

# With remote database
pnpm start

# With local database (requires container engine, e.g., Rancher)
pnpm exec supabase start 
pnpm run dev
```

## TODO

Things to do before focusing on the UX:

* [ ] Error handling on game client
* [ ] Migrate production data from old app
* [ ] How to manage secret env variables
* [ ] How to use supabase database migration
* [ ] Data model for game statistics (totals, leaders, etc.)
* [ ] Write test to access real database
* [ ] SQL to restore database schema?

