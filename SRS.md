# CivicLens Karnataka — Software Requirements Specification

## 1. System Overview

CivicLens is a responsive web application implemented with:

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui
* Firebase Firestore
* Firebase Authentication
* Cloudinary
* OpenAI API
* MapLibre or equivalent map tooling
* Vercel

Government integrations are represented by an isolated mock service.

---

## 2. Actors

### Citizen

Can:

* upload evidence
* confirm issue
* confirm location
* review complaint
* submit mock case
* track case
* view profile
* share badge

### AI Service

Can:

* analyze images
* classify visible issues
* describe evidence
* suggest severity
* draft factual complaints
* explain statuses

### Civic Intelligence Engine

Can:

* locate synthetic civic assets
* find related projects
* find tender information
* find authority information
* calculate simulated maintenance status
* detect duplicate issues

### Mock Government Service

Can:

* receive synthetic case
* generate reference number
* return simulated status
* generate simulated timeline

---

## 3. Functional Requirements

### SR-01 Home

Display:

* CivicLens branding
* Report a Problem
* Nearby Issues
* My Cases
* My Civic Profile

### SR-02 Image Upload

Support:

* mobile camera
* gallery upload
* demo image

Accepted formats:

* JPG
* JPEG
* PNG
* WEBP

### SR-03 Image Analysis

Server sends image to OpenAI.

Expected structured output:

```json
{
  "issueType": "pothole",
  "confidence": 0.96,
  "severity": "high",
  "description": "Large road surface defect",
  "evidenceNotes": [
    "surface depression",
    "possible vehicle hazard"
  ],
  "needsHumanReview": false
}
```

The application must treat this as AI assistance rather than absolute truth.

---

## 4. Human Confirmation

After AI detection:

**Pothole detected**

Actions:

* Looks right
* Change category

The user must be able to change the category.

---

## 5. Location

Support:

### Current location

Browser permission.

### Manual

User enters/selects location.

### Demo location

Used for judging reliability.

Store:

* latitude
* longitude
* address
* ward
* district

Do not force precise location permission.

---

## 6. Civic Asset Matching

Input:

* latitude
* longitude
* issue type

System searches synthetic civic asset records.

Example:

```text
ROAD-DEMO-1042
```

Then follows:

```text
Asset
 ↓
Project
 ↓
Tender
 ↓
Contractor
 ↓
Authority
```

---

## 7. Maintenance Calculation

Do not use AI.

Use deterministic logic:

```text
maintenanceEnd =
completionDate + maintenanceMonths

if currentDate <= maintenanceEnd:
    maintenanceStatus = ACTIVE
else:
    maintenanceStatus = EXPIRED
```

UI must say:

> **Simulated maintenance period: ACTIVE**

not:

> Contractor is legally responsible.

---

## 8. Duplicate Detection

Search for active similar issues within a configurable radius.

Suggested demo radius:
**100–200 metres**

Match:

* issue type
* location
* active status

If match exists:

> **This issue may already be reported nearby.**

Actions:

* Add My Evidence
* Report Separately

---

## 9. Complaint Generation

AI receives only user-approved information.

Generate:

* title
* category
* description
* location
* evidence summary
* project reference
* requested action

Example:

> Road surface damage reported at the selected location. Supporting photographs are attached. The related project record indicates a simulated active maintenance period. Please inspect the affected road section.

No allegations.

---

## 10. Complaint Review

All generated text must be editable.

Primary button:

**Submit Demo Case**

Disclosure:

> **Government submission is simulated in this prototype.**

---

## 11. Mock Government Submission

Endpoint:

```text
POST /api/mock-government/submit
```

Example response:

```json
{
  "caseId": "DEMO-CIV-10482",
  "status": "RECEIVED",
  "destination": "Demo Municipal Road Division",
  "simulated": true
}
```

---

## 12. Tracking

Timeline:

```text
Evidence received
        ↓
Location confirmed
        ↓
Asset matched
        ↓
Case prepared
        ↓
Routed
        ↓
Inspection
        ↓
Repair
        ↓
Resolved
```

Every status should have:

* What this means
* What the citizen needs to do

---

## 13. Firestore Data Model

### users

```text
id
displayName
email
avatarUrl
createdAt
```

### civicIssues

```text
id
issueType
severity
confidence
description
latitude
longitude
address
ward
district
status
createdBy
createdAt
dataSource
```

### issueEvidence

```text
id
issueId
mediaUrl
mediaType
aiAnalysis
createdAt
```

### civicAssets

```text
id
assetType
assetName
latitude
longitude
ward
district
projectId
authorityId
dataSource
```

### projects

```text
id
projectName
projectType
tenderId
contractorId
authorityId
startDate
completionDate
maintenanceMonths
dataSource
```

### tenders

```text
id
tenderNumber
title
contractorId
contractValue
awardDate
dataSource
```

### contractors

```text
id
name
reference
dataSource
```

### authorities

```text
id
name
department
division
jurisdiction
dataSource
```

### complaints

```text
id
issueId
authorityId
projectId
referenceNumber
status
submittedAt
resolvedAt
isMock
```

### complaintEvents

```text
id
complaintId
eventType
title
description
createdAt
isSimulated
```

### badges

```text
id
name
description
icon
criteria
```

### contributorProfiles

```text
id
userId
verifiedReports
resolvedIssues
evidenceContributions
badges
shareSlug
```

---

## 14. API Structure

```text
/api/analyze-image
/api/issues
/api/issues/[id]
/api/assets/nearby
/api/projects/[id]
/api/complaints/draft
/api/mock-government/submit
/api/complaints/[id]
/api/complaints/[id]/confirm-resolution
/api/profile
/api/badges
```

---

## 15. Error Requirements

### AI failure

Show retry and manual classification.

### Location denied

Offer manual location.

### No asset match

Show:

> No matching demo civic record found.

Offer generic routing.

### Upload failure

Show retry.

### Network failure

Preserve user input.

### Mock submission failure

Allow retry.

---

## 16. Security

* OpenAI API key must remain server-side.
* Validate uploaded files.
* Use Firebase Security Rules.
* Minimize stored personal information.
* Never expose private credentials.
* Never trust client-provided authority/project IDs without server validation.

---

## 17. Accessibility

* Semantic HTML
* Keyboard navigation
* Visible focus
* Accessible labels
* Alt text
* Large touch targets
* Good contrast
* Icons plus text
* No color-only status meaning

---

## 18. Performance

* Compress images where practical.
* Lazy-load maps.
* Avoid blocking initial page.
* Cache static demo data.
* Show progress during AI processing.
* Keep initial bundle reasonable.

---

## 19. Acceptance Test

The primary journey passes when:

```text
Upload image
 ↓
AI detects pothole
 ↓
Confirm category
 ↓
Confirm location
 ↓
Find synthetic asset
 ↓
Find project
 ↓
Find tender
 ↓
Calculate maintenance
 ↓
Generate complaint
 ↓
Review
 ↓
Mock submit
 ↓
Track
 ↓
Resolve
 ↓
Badge
```

All stages must work without dead-end screens.
