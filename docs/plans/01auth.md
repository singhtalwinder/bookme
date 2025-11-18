Auth & Accounts
Goals
OTP for every login
User belongs to exactly one business at a time
Staff invites without email domain verification
User Stories
As a user, I log in with OTP each session to enhance security.
As an owner, I can invite staff by email without domain checks.
As a system, I prevent any user from joining multiple businesses concurrently.
Flows
Sign up: email + password → create business (owner) or accept invite → OTP verify → session
Login: email + password → OTP (email code) → session established
Forgot password: request → OTP → reset
Data Model
users(id, email unique, name, avatar_url, created_at)
organizations(id, name, handle unique, timezone, phone, address, brand_color, logo_url, currency=HKD)
memberships(id, user_id unique, org_id, role enum(owner,admin,staff,receptionist,viewer), created_at)
Unique constraint on user_id to enforce one-business rule
RLS filters all org tables by org_id via JWT claim
Security
RLS: org_id = auth.org_id()
Short-lived sessions; refresh on OTP
Audit login events (optional table: auth_events)
API/Contracts
POST /api/auth/invite: {email, role}
POST /api/auth/accept-invite: {token}
POST /api/auth/otp/send, /verify
Edge Cases
Attempt to accept second org invite → error: already in a business
Invite to existing user in another org → block with guidance
Acceptance Criteria
OTP enforced every login
Cannot create second membership for a user
