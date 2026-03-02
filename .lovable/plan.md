

## Set Up Admin Account

Create an admin account for `derek.taylor@t3sixty.com` with proper role-based access control.

### Steps

1. **Database migration** -- Create the `user_roles` table and `has_role` helper function following security best practices (role enum, RLS, security-definer function). Add an RLS policy on `leads` so only admins can SELECT.

2. **Create the admin user** -- Use the authentication system to create a user with email `derek.taylor@t3sixty.com` and a temporary password. Auto-confirm the email so you can log in immediately.

3. **Assign admin role** -- Insert a row into `user_roles` granting the admin role to the new user via a migration that looks up the user by email.

4. **Secure the Admin page** -- Update `/admin` to check the `has_role` function after login, ensuring only users with the admin role can view the dashboard. Show an "access denied" message for non-admin users.

### Temporary Password

You will be able to log in with:
- **Email:** `derek.taylor@t3sixty.com`  
- **Password:** A temporary password (will be shown after creation)

You should change it after your first login.

