# CivicLens Karnataka — System Architecture

## 1. Architecture Objective

Create a real working prototype while keeping all government dependencies synthetic and safely isolated.

---

## 2. Technology Stack

| Layer                  | Technology                          |
| ---------------------- | ----------------------------------- |
| Frontend               | Next.js                             |
| Language               | TypeScript                          |
| UI                     | React + Tailwind CSS + shadcn/ui    |
| Hosting                | Vercel                              |
| Database               | Firebase Firestore                  |
| Authentication         | Firebase Auth                       |
| Media                  | Cloudinary                          |
| AI                     | OpenAI API                          |
| Maps                   | MapLibre GL JS + suitable map tiles |
| Source control         | GitHub                              |
| Development agent      | Codex / Antigravity                 |
| UI generation          | Stitch MCP                          |
| Government integration | Mock API                            |

---

## 3. High-Level Architecture

```text
                    CITIZEN
                       |
                       v
                MOBILE / DESKTOP
                       |
                       v
                NEXT.JS APPLICATION
                       |
            +----------+----------+
            |                     |
            v                     v
       SERVER/API             FIREBASE
            |              Firestore/Auth
            |
      +-----+-------+
      |             |
      v             v
   OPENAI       CLOUDINARY
      |             |
      |             v
      |          Evidence
      |
      v
AI Detection
      |
      v
Civic Intelligence
      |
      v
Synthetic Civic Registry
      |
      v
Mock Government Router
      |
      v
Complaint Tracking
      |
      v
Contributor Recognition
```

---

## 4. AI Architecture

AI is used for tasks where language/vision reasoning provides value.

### AI responsibilities

* Image classification
* Evidence description
* Severity suggestion
* Complaint drafting
* Status explanation

### AI must not determine

* Legal guilt
* Corruption
* Criminality
* Personal liability
* Contractor liability
* Officer guilt

---

## 5. Deterministic Civic Intelligence

The system uses normal application logic for:

```text
Location
   ↓
Civic Asset
   ↓
Project
   ↓
Tender
   ↓
Contractor
   ↓
Authority
```

This information comes from synthetic demo records.

---

## 6. Maintenance Engine

Example:

```text
completionDate = 2025-03-15
maintenanceMonths = 24
```

System calculates:

```text
maintenanceEnd = 2027-03-15
```

If today's date is before that:

```text
ACTIVE
```

Otherwise:

```text
EXPIRED
```

Display:

> Simulated maintenance period: ACTIVE

---

## 7. Image Architecture

```text
Citizen
   |
   v
Browser
   |
   v
Cloudinary
   |
   v
Next.js Server
   |
   v
OpenAI
   |
   v
Structured JSON
   |
   v
Firestore
```

Cloudinary is responsible for media.

Firestore stores metadata and references.

---

## 8. Firebase Architecture

Firestore collections:

```text
users
civicIssues
issueEvidence
civicAssets
projects
tenders
contractors
authorities
complaints
complaintEvents
badges
contributorProfiles
```

Every synthetic civic record should contain:

```text
dataSource: "SYNTHETIC_DEMO"
```

---

## 9. Synthetic Civic Registry

Example:

```text
Asset:
ROAD-DEMO-1042

Road:
Demo Main Road

Ward:
Demo Ward 42

Project:
Demo Road Improvement Package

Tender:
DEMO-TND-2025-104

Contractor:
Demo Infrastructure Pvt Ltd.

Completion:
15 March 2025

Maintenance:
24 months

Authority:
Demo Municipal Road Division
```

The UI must clearly identify it as synthetic.

---

## 10. Duplicate Detection

Input:

```text
latitude
longitude
issueType
```

Search nearby issues.

If a similar active issue exists:

```text
Existing issue found
```

The citizen can attach evidence to the existing case.

---

## 11. Mock Government Layer

CivicLens must not connect to live government systems during the prototype.

Use:

```text
/api/mock-government/submit
```

Example:

```json
{
  "caseId": "DEMO-CIV-10482",
  "status": "RECEIVED",
  "destination": "Demo Municipal Road Division",
  "simulated": true
}
```

This layer is intentionally replaceable.

In production it could eventually be replaced by an authorized integration.

---

## 12. Trust and Provenance

Each civic record should contain:

```text
sourceType
sourceReference
verified
lastUpdated
dataSource
```

Example:

```json
{
  "sourceType": "SYNTHETIC_DEMO",
  "sourceReference": "DEMO-ROAD-1042",
  "verified": false,
  "lastUpdated": "2026-08-28",
  "dataSource": "SYNTHETIC_DEMO"
}
```

---

## 13. Security Architecture

```text
Browser
   |
   v
Next.js Server
   |
   +---- Firebase
   |
   +---- Cloudinary
   |
   +---- OpenAI
```

OpenAI secrets remain server-side.

No secret API keys in client JavaScript.

---

## 14. Deployment

```text
GitHub
   |
   v
Vercel
   |
   +---- Next.js frontend
   +---- Next.js server/API
           |
           +---- Firebase
           +---- Cloudinary
           +---- OpenAI
```

Final URL must be publicly accessible without requesting access.

---

## 15. Production Evolution

Future architecture could support:

* Authorized government APIs
* Verified public datasets
* Audited routing
* Geospatial indexing
* Queued AI processing
* Monitoring
* Role-based access
* Data provenance
* Consent management
* Data minimization

The hackathon prototype should not attempt these production integrations.

---

## 16. Architecture Principle

The most important architecture rule:

> **AI assists understanding; deterministic systems establish relationships; the citizen remains in control; government systems remain the future system of record.**
