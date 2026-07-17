diff --git a/script.js b/script.js
index df058ee98f8f3eaa3aacd6c0e6965ebc4d4118a6..cf3016c403b2bb74c7fe3e0771b8c2df2bd66dbe 100644
--- a/script.js
+++ b/script.js
@@ -1,101 +1,259 @@
-const settings = {
-  businessName: "Jubilee-Luxury-Mobile-Detailing Co.",
-  phone: "+6153487683",
-  displayPhone: "(615) 348-7683",
-  email: "Contact@jubileeexecutivecarservice.com",
-  calendlyUrl: "https://calendly.com/aarmstrong1234",
-  formspreeEndpoint: "https://formspree.io/f/xqewgnbb",
+const CURRENT_TECHNICIAN_ID = "emp-102";
+
+const statusColors = {
+  scheduled: "#2f80ed",
+  "in progress": "#27ae60",
+  assigned: "#9b51e0",
+  pending: "#f2c94c",
+  completed: "#bdbdbd",
+  cancelled: "#eb5757",
+  "reschedule requested": "#f2994a",
 };
 
-const bookingLink = document.getElementById("bookingLink");
-const quoteForm = document.getElementById("quoteForm");
-const formMessage = document.getElementById("formMessage");
-const phoneLink = document.getElementById("phoneLink");
-const emailLink = document.getElementById("emailLink");
-const yearLabel = document.getElementById("year");
-const businessNameLabel = document.getElementById("businessName");
-const nextRedirectInput = document.getElementById("nextRedirect");
-
-const serviceAddressInput = document.getElementById("serviceAddress");
-const addressPlaceIdInput = document.getElementById("addressPlaceId");
-const addressLatInput = document.getElementById("addressLat");
-const addressLngInput = document.getElementById("addressLng");
-const addressHint = document.getElementById("addressHint");
-
-if (bookingLink) bookingLink.href = settings.calendlyUrl;
-if (quoteForm) quoteForm.action = settings.formspreeEndpoint;
-if (nextRedirectInput) nextRedirectInput.value = settings.calendlyUrl;
-
-if (phoneLink) {
-  phoneLink.href = `tel:${settings.phone}`;
-  phoneLink.textContent = `Call ${settings.displayPhone}`;
-}
+const mobileWashJobs = [
+  {
+    serviceRequestNumber: "SR-000245",
+    customerName: "John Smith",
+    package: "Premium Wash",
+    status: "scheduled",
+    scheduledStart: "2026-07-17T10:00:00",
+    scheduledEnd: "2026-07-17T11:15:00",
+    assignedEmployeeId: "emp-102",
+    address: "123 Main St, Nashville, TN",
+    zipCode: "37203",
+    latitude: 36.1581,
+    longitude: -86.7785,
+    weatherScore: 94,
+  },
+  {
+    serviceRequestNumber: "SR-000246",
+    customerName: "Alicia Brown",
+    package: "Express Exterior",
+    status: "assigned",
+    scheduledStart: "2026-07-17T11:45:00",
+    scheduledEnd: "2026-07-17T12:30:00",
+    assignedEmployeeId: "emp-102",
+    address: "210 12th Ave S, Nashville, TN",
+    zipCode: "37203",
+    latitude: 36.1528,
+    longitude: -86.7847,
+    weatherScore: 91,
+  },
+  {
+    serviceRequestNumber: "SR-000247",
+    customerName: "Marcus Lee",
+    package: "Fleet Quick Wash",
+    status: "in progress",
+    scheduledStart: "2026-07-17T13:00:00",
+    scheduledEnd: "2026-07-17T14:00:00",
+    assignedEmployeeId: "emp-102",
+    address: "901 Woodland St, Nashville, TN",
+    zipCode: "37206",
+    latitude: 36.1759,
+    longitude: -86.7555,
+    weatherScore: 89,
+  },
+  {
+    serviceRequestNumber: "SR-000248",
+    customerName: "Priya Patel",
+    package: "Interior Reset",
+    status: "pending",
+    scheduledStart: "2026-07-17T15:00:00",
+    scheduledEnd: "2026-07-17T16:10:00",
+    assignedEmployeeId: "emp-104",
+    address: "4000 Hillsboro Pike, Nashville, TN",
+    zipCode: "37215",
+    latitude: 36.1046,
+    longitude: -86.8157,
+    weatherScore: 86,
+  },
+  {
+    serviceRequestNumber: "SR-000249",
+    customerName: "Ethan Johnson",
+    package: "Complete Detail",
+    status: "completed",
+    scheduledStart: "2026-07-17T08:00:00",
+    scheduledEnd: "2026-07-17T09:30:00",
+    assignedEmployeeId: "emp-102",
+    address: "2500 West End Ave, Nashville, TN",
+    zipCode: "37203",
+    latitude: 36.1468,
+    longitude: -86.8062,
+    weatherScore: 96,
+  },
+  {
+    serviceRequestNumber: "SR-000250",
+    customerName: "Sandra Miller",
+    package: "Premium Wash",
+    status: "cancelled",
+    scheduledStart: "2026-07-17T16:30:00",
+    scheduledEnd: "2026-07-17T17:15:00",
+    assignedEmployeeId: "emp-102",
+    address: "600 James Robertson Pkwy, Nashville, TN",
+    zipCode: "37243",
+    latitude: 36.1692,
+    longitude: -86.7836,
+    weatherScore: 80,
+  },
+  {
+    serviceRequestNumber: "SR-000251",
+    customerName: "Noah Davis",
+    package: "Express Exterior",
+    status: "reschedule requested",
+    scheduledStart: "2026-07-17T09:45:00",
+    scheduledEnd: "2026-07-17T10:30:00",
+    assignedEmployeeId: "emp-102",
+    address: "1111 Fatherland St, Nashville, TN",
+    zipCode: "37206",
+    latitude: 36.1731,
+    longitude: -86.7477,
+    weatherScore: 74,
+  },
+  {
+    serviceRequestNumber: "SR-000252",
+    customerName: "Grace Wilson",
+    package: "Premium Wash",
+    status: "scheduled",
+    scheduledStart: "2026-07-17T17:30:00",
+    scheduledEnd: "2026-07-17T18:30:00",
+    assignedEmployeeId: "emp-102",
+    address: "1 Titans Way, Nashville, TN",
+    zipCode: "37213",
+    latitude: 36.1665,
+    longitude: -86.7713,
+    weatherScore: 92,
+  },
+];
+
+const map = L.map("jobMap", { zoomControl: true }).setView([36.1627, -86.7816], 12);
+L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
+  maxZoom: 19,
+  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
+}).addTo(map);
+
+const markerLayer = L.layerGroup().addTo(map);
+let routeLine = L.polyline([], { color: "#0f4c81", weight: 4, opacity: 0.8, dashArray: "8 10" }).addTo(map);
+
+const elements = {
+  statusFilter: document.getElementById("statusFilter"),
+  compactStatusFilter: document.getElementById("compactStatusFilter"),
+  zipFilter: document.getElementById("zipFilter"),
+  dateFilter: document.getElementById("dateFilter"),
+  customerFilter: document.getElementById("customerFilter"),
+  todayOnlyFilter: document.getElementById("todayOnlyFilter"),
+  myJobsFilter: document.getElementById("myJobsFilter"),
+  todayJobsCount: document.getElementById("todayJobsCount"),
+  remainingJobsCount: document.getElementById("remainingJobsCount"),
+  driveTime: document.getElementById("driveTime"),
+  refreshButton: document.getElementById("refreshButton"),
+  lastUpdated: document.getElementById("lastUpdated"),
+};
 
-if (emailLink) {
-  emailLink.href = `mailto:${settings.email}`;
-  emailLink.textContent = settings.email;
+elements.dateFilter.value = "2026-07-17";
+
+function formatTime(value) {
+  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
 }
 
-if (yearLabel) yearLabel.textContent = String(new Date().getFullYear());
-if (businessNameLabel) businessNameLabel.textContent = settings.businessName;
+function isSameDate(value, dateString) {
+  return value.slice(0, 10) === dateString;
+}
 
-function clearAddressMetadata() {
-  if (addressPlaceIdInput) addressPlaceIdInput.value = "";
-  if (addressLatInput) addressLatInput.value = "";
-  if (addressLngInput) addressLngInput.value = "";
+function markerIcon(status) {
+  return L.divIcon({
+    className: "",
+    html: `<span class="status-marker" style="display:block;background:${statusColors[status] || statusColors.pending}"></span>`,
+    iconSize: [22, 22],
+    iconAnchor: [11, 11],
+    popupAnchor: [0, -12],
+  });
 }
 
-if (serviceAddressInput) {
-  serviceAddressInput.addEventListener("input", clearAddressMetadata);
+function popupTemplate(job) {
+  const destination = encodeURIComponent(job.address);
+  return `
+    <article class="job-popup">
+      <h3>Service Request: ${job.serviceRequestNumber}</h3>
+      <dl>
+        <div><dt>Customer:</dt><dd>${job.customerName}</dd></div>
+        <div><dt>Package:</dt><dd>${job.package}</dd></div>
+        <div><dt>Status:</dt><dd>${job.status.replace(/\b\w/g, (letter) => letter.toUpperCase())}</dd></div>
+        <div><dt>Scheduled:</dt><dd>${formatTime(job.scheduledStart)}</dd></div>
+        <div><dt>Address:</dt><dd>${job.address}</dd></div>
+        <div><dt>Weather Score:</dt><dd>${job.weatherScore}</dd></div>
+      </dl>
+      <a class="btn-action" href="https://www.google.com/maps/dir/?api=1&destination=${destination}" target="_blank" rel="noreferrer">Navigate</a>
+      <button class="btn-action secondary" type="button">Start Service</button>
+      <button class="btn-action ghost" type="button">View Details</button>
+    </article>`;
 }
 
-window.initGooglePlaces = function initGooglePlaces() {
-  if (!window.google?.maps?.places || !serviceAddressInput) {
-    if (addressHint) {
-      addressHint.textContent =
-        "Google Places did not load. You can still type your full service address manually.";
-    }
-    return;
-  }
+function filteredJobs() {
+  const status = elements.statusFilter.value;
+  const zip = elements.zipFilter.value.trim();
+  const date = elements.dateFilter.value;
+  const customer = elements.customerFilter.value.trim().toLowerCase();
 
-  const autocomplete = new google.maps.places.Autocomplete(serviceAddressInput, {
-    fields: ["formatted_address", "geometry", "place_id"],
-    types: ["address"],
+  return mobileWashJobs.filter((job) => {
+    if (status !== "all" && job.status !== status) return false;
+    if (zip && !job.zipCode.includes(zip)) return false;
+    if (date && !isSameDate(job.scheduledStart, date)) return false;
+    if (customer && !job.customerName.toLowerCase().includes(customer)) return false;
+    if (elements.todayOnlyFilter.checked && !isSameDate(job.scheduledStart, "2026-07-17")) return false;
+    if (elements.myJobsFilter.checked && job.assignedEmployeeId !== CURRENT_TECHNICIAN_ID) return false;
+    return true;
   });
+}
 
-  autocomplete.addListener("place_changed", () => {
-    const place = autocomplete.getPlace();
-
-    if (!place?.formatted_address) return;
+function estimateDriveTime(jobs) {
+  const activeStops = jobs.filter((job) => !["completed", "cancelled", "reschedule requested"].includes(job.status)).length;
+  return activeStops ? `${Math.max(12, activeStops * 8 + 2)} min` : "0 min";
+}
 
-    serviceAddressInput.value = place.formatted_address;
+function renderMap() {
+  const jobs = filteredJobs();
+  markerLayer.clearLayers();
 
-    if (addressPlaceIdInput) addressPlaceIdInput.value = place.place_id || "";
-    if (place.geometry?.location) {
-      if (addressLatInput) addressLatInput.value = String(place.geometry.location.lat());
-      if (addressLngInput) addressLngInput.value = String(place.geometry.location.lng());
-    }
+  jobs.forEach((job) => {
+    L.marker([job.latitude, job.longitude], { icon: markerIcon(job.status), title: job.serviceRequestNumber })
+      .bindPopup(popupTemplate(job), { maxWidth: 320 })
+      .addTo(markerLayer);
   });
-};
 
-if (quoteForm) {
-  quoteForm.addEventListener("submit", (event) => {
-    if (!quoteForm.checkValidity()) {
-      event.preventDefault();
-      quoteForm.reportValidity();
-      return;
-    }
-
-    if (settings.formspreeEndpoint.includes("your-form-id")) {
-      event.preventDefault();
-      if (formMessage) {
-        formMessage.textContent = "Setup required: add your real Formspree endpoint in script.js.";
-      }
-      return;
-    }
-
-    if (formMessage) {
-      formMessage.textContent = "Submitting your details, then redirecting you to booking...";
-    }
-  });
+  const routeJobs = jobs
+    .filter((job) => !["cancelled"].includes(job.status))
+    .sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));
+  const routePoints = routeJobs.map((job) => [job.latitude, job.longitude]);
+  routeLine.setLatLngs(routePoints);
+
+  if (jobs.length) {
+    const bounds = L.latLngBounds(jobs.map((job) => [job.latitude, job.longitude]));
+    map.fitBounds(bounds.pad(0.18));
+  }
+
+  const todaysJobs = mobileWashJobs.filter((job) => isSameDate(job.scheduledStart, "2026-07-17"));
+  const remaining = todaysJobs.filter((job) => !["completed", "cancelled", "reschedule requested"].includes(job.status));
+  elements.todayJobsCount.textContent = String(todaysJobs.length);
+  elements.remainingJobsCount.textContent = String(remaining.length);
+  elements.driveTime.textContent = estimateDriveTime(remaining);
+  elements.lastUpdated.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
+}
+
+function syncStatusFilters(source, target) {
+  target.value = source.value;
+  renderMap();
 }
+
+elements.statusFilter.addEventListener("change", () => syncStatusFilters(elements.statusFilter, elements.compactStatusFilter));
+elements.compactStatusFilter.addEventListener("change", () => syncStatusFilters(elements.compactStatusFilter, elements.statusFilter));
+[
+  elements.zipFilter,
+  elements.dateFilter,
+  elements.customerFilter,
+  elements.todayOnlyFilter,
+  elements.myJobsFilter,
+].forEach((element) => element.addEventListener("input", renderMap));
+elements.refreshButton.addEventListener("click", renderMap);
+
+renderMap();
+setTimeout(() => map.invalidateSize(), 100);

