# Smart Drive Car Hire — starter website

This is the first custom-coded, mobile-responsive front-end milestone for Smart Drive Car Hire.

## Included
- Black-and-gold responsive homepage
- Fleet catalogue with 27 vehicle entries and starting rates from the provided catalogue
- Category filters
- Guest booking enquiry form (no customer account)
- Self-drive / chauffeur-driven / recommend an option
- Date validation
- WhatsApp enquiry handoff to 0733 920 806
- Rental terms summary and contact details

## Important limits of this first milestone
This is a front-end prototype, not yet the complete live booking management system.
- Booking form currently sends an enquiry to WhatsApp; it does not save a reservation to a database.
- Availability is not yet checked against confirmed bookings.
- There is no admin login/dashboard yet.
- Payment instructions and payment ledger are not connected yet.
- Fleet images are placeholders; add the approved vehicle photos later.
- Confirm the official office/telephone details, payment instructions, final pricing, and legal/privacy wording before launch.

## Preview
Open `index.html` in a browser. On a phone, you can upload the files to a code workspace such as Replit or a GitHub repository and preview from there. Keep your own copy of the source files.

## Next development milestone
Add a secure backend and database, for example a Node.js/TypeScript API with PostgreSQL, including:
1. Admin authentication and roles
2. Vehicle CRUD and photo management
3. Date-overlap availability validation on the server
4. Booking records and status history
5. Manual payment ledger and administrator verification
6. Quotes/invoices, rental agreement records, handover/return checklist
7. Secure backups, privacy controls and audit logs

Never put database credentials, admin passwords, or private payment account credentials in front-end files.
