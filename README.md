diff --git a/README.md b/README.md
index 059154ec867025aa83c28ed2f6114ba4feffde6d..fb60e69ba5f4e018940f10b711942140bad965c2 100644
--- a/README.md
+++ b/README.md
@@ -1,71 +1,53 @@
-# Mobile Detailing Business System (GitHub-Ready)
+# JECS Quick Wash Mobile Wash Pro
 
-A deploy-ready static website for a mobile detailing business with a black-and-gold executive visual theme.
+A mobile-first technician workspace that opens directly into an interactive map instead of a table. Dispatchers can continue to work from the administrative dashboard while technicians use this component as the primary field operations view.
 
 ## What this includes
 
-- ✅ GitHub Pages hosting setup (with GitHub Actions workflow)
-- ✅ Plain HTML/CSS/JS frontend (fastest launch)
-- ✅ Formspree-compatible quote form (or swap with Google Forms)
-- ✅ Calendly booking link (or replace with Square)
-- ✅ CRM flow guidance for HubSpot Free or Google Sheets
+- ✅ Leaflet + OpenStreetMap technician map
+- ✅ Color-coded service request markers
+- ✅ Filter panel for status, ZIP code, appointment date, customer name, today's jobs, and assigned jobs
+- ✅ Marker pop-ups with service request details, weather score, navigation, start service, and view details actions
+- ✅ Daily route visualization connecting assigned stops in appointment order
+- ✅ Summary metrics for today's jobs, remaining work, and estimated drive time
+
+## Data source alignment
+
+The first version can be powered by existing Supabase tables without additional schema changes:
+
+- `customers.latitude`
+- `customers.longitude`
+- `customers.full_name`
+- `customers.formatted_address`
+- `customers.zip_code`
+- `service_requests.status`
+- `service_requests.requested_date`
+- `service_requests.service_request_number`
+- `service_requests.customer_id`
+- `appointments.appointment_status`
+- `appointments.scheduled_start`
+- `appointments.scheduled_end`
+- `appointments.assigned_employee_id`
+
+Conceptually, the component expects customer records with nested service requests and appointments so each marker can render without follow-up API calls.
 
 ## Project structure
 
-- `index.html` — business landing page + quote + booking + CRM sections
-- `styles.css` — responsive styles
-- `script.js` — single settings object for phone/email/Formspree/Calendly
-- `.github/workflows/deploy-pages.yml` — automatic GitHub Pages deployment on `main`
+- `index.html` — map-first Mobile Wash Pro shell
+- `styles.css` — responsive technician workspace, filters, legend, metrics, and marker styling
+- `script.js` — sample job data, Leaflet rendering, filtering, pop-ups, and route drawing
 
-## 5-minute setup
+## Local preview
 
-Default repository values are pre-filled for Jubilee Luxury Mobile Detailing.
+```bash
+python3 -m http.server 4173
+```
 
-1. **Edit `script.js`**
-   - `phone`
-   - `displayPhone`
-   - `email`
-   - `calendlyUrl`
-   - `formspreeEndpoint`
+Then open `http://localhost:4173`.
 
-2. **Push to GitHub**
-   ```bash
-   git add .
-   git commit -m "Configure mobile detailing site"
-   git push origin main
-   ```
+## Next integration steps
 
-3. **Enable Pages in repository settings**
-   - Settings → Pages
-   - Build and deployment source: **GitHub Actions**
-
-4. **Test live website**
-   - Submit quote form
-   - Open booking link
-   - Verify contact links
-
-## Address autocomplete (Google Places)
-
-The quote form includes a **Service Address** field with Google Places autocomplete.
-
-- Script used in `index.html`:
-  `https://maps.googleapis.com/maps/api/js?key=AIzaSyARZAA619g3JlruK77Lfm8vlopcR76vRGg&libraries=places&callback=initGooglePlaces`
-- Captured fields sent with form:
-  - `service_address`
-  - `address_place_id`
-  - `address_lat`
-  - `address_lng`
-
-> Important: Restrict the Google Maps API key by HTTP referrer and enable only required APIs in Google Cloud.
-
-## Tool choices supported
-
-- Hosting: **GitHub Pages** (free)
-- Frontend: **HTML/CSS** (optional Tailwind later)
-- Forms: **Formspree** or **Google Forms**
-- Booking: **Calendly** or **Square Appointments**
-- CRM: **HubSpot Free** or **Google Sheets**
-
-## Optional upgrade path
-
-- Move hosting/forms to Netlify later if you want easier automation.
+1. Replace the sample `mobileWashJobs` array in `script.js` with a Supabase query that joins customers, service requests, and appointments.
+2. Connect the Start Service and Complete Service buttons to appointment status updates.
+3. Scope `CURRENT_TECHNICIAN_ID` to the authenticated employee.
+4. Add route optimization after multiple stops are assigned.
