Services Management
Entities
service_categories
services: name, description, duration_min, price, online_bookable, buffer_before/after, max_concurrent
service_variants: name, duration_delta_min, price_delta
seniority_titles: custom list per org (max 10)
tiered_prices: per service x seniority_title (percent, absolute, or explicit price)
staff_service_overrides: per staff x service price/duration override
Rules
Price resolution order:

staff_service_override (if present)
tiered price for staff’s seniority_title
service base price
Policies
Cancellation window default 24h; editable in Settings
Late policy informational
AC
Admin creates tiers/variants and sees computed prices for staff by title
Booking flow displays correct computed price
