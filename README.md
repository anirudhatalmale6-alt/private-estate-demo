# Holland & Gray — Private Estate Management (concept demo)

A working demonstration built for a Melbourne private estate management business:
a quiet-luxury public website plus a private client portal.

**Live demo:** https://anirudhatalmale6-alt.github.io/private-estate-demo/

Brand name, team, copy and every figure are placeholders for the demonstration.

## Public website

| Page | File |
|---|---|
| Home | `index.html` |
| Services & Membership | `membership.html` |
| About Us | `about.html` |
| Contact / Private Consultation | `contact.html` |
| Terms & Privacy | `terms.html` |

No prices are displayed anywhere. The single call to action throughout is
**Request a Private Consultation**.

## Private Client Portal — `/portal`

| Screen | File |
|---|---|
| Sign in | `portal/index.html` |
| Dashboard / Estate Overview | `portal/dashboard.html` |
| Property Information | `portal/property.html` |
| Service Requests (filterable list) | `portal/requests.html` |
| Request detail — tracking, quote approval, uploads | `portal/request.html` |
| Documents & Records | `portal/documents.html` |
| Maintenance / Service History | `portal/history.html` |
| Messaging with Estate Manager | `portal/messages.html` |

Request workflow: **New → In Progress → Awaiting Approval → Scheduled → Completed**

### What actually works in the demo

- Approve or decline a quotation — status, tracker and audit note all update
- Filter the request list by status
- Raise a new service request (modal, with photo attachment)
- Drag-and-drop file upload on requests and documents
- Send a message to the estate manager and receive a reply
- Fully responsive: desktop, tablet, mobile

## Notes

Static HTML/CSS/JS — no build step, no dependencies. Open `index.html` or serve
the folder with any static server. The portal is front-end only in this demo;
the production build adds authentication, a database, file storage, email
notification and an internal admin side for the estate managers.
