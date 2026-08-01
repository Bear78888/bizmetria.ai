# Wrong Supabase target incident

- **Detected:** 2026-07-31 America/Los_Angeles (2026-08-01 UTC); the exact initial SQL execution time remains available only in provider audit logs.
- **Owner-reported incident ref:** `wioaqrwsc1gxabfuufg`.
- **Dashboard-observed modified ref:** `wioaqrwsclgxabfuufqg`.
- **Incorrect draft PR:** [#20](https://github.com/Bear78888/bizmetria.ai/pull/20), closed without merge as `Superseded — incorrect Supabase project target`.
- **Applied file:** `20260731000200_production_schema_reconciliation.sql`, executed outside repository migration history through the SQL Editor.
- **Added object categories:** BizMetria tables, constraints, indexes, RLS policies, helper functions, triggers, grants, and the private `reports` Storage bucket.
- **Preservation:** legacy tables, Auth users, Storage buckets, and their row data were not deleted or rolled back.
- **Freeze:** no subsequent write operation is authorized against the incident project.
- **Cleanup:** any inventory, cleanup SQL, rollback, deletion, or repair requires a separate owner-approved incident task.

No user-row contents or credential values are included in this record.
