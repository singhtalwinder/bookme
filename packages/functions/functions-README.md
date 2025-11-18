# Edge Functions

Supabase Edge Functions for background processing and external integrations.

## Structure

Functions will be organized by domain:

- `notifications/` - Email and notification delivery
- `sync/` - Calendar synchronization (Google, Microsoft)
- `exports/` - CSV and data export generation
- `webhooks/` - External webhook handlers

## Development

To run functions locally:

```bash
supabase functions serve
```

To deploy a function:

```bash
supabase functions deploy function-name
```

## Environment Variables

Functions require environment variables to be set in Supabase Dashboard:
- Email API keys
- OAuth credentials
- Database connection strings

## Implementation

Edge functions will be implemented in later phases:
- **M3.5**: Notification and email functions
- **M4**: Calendar sync functions
- **M5**: Export generation functions

