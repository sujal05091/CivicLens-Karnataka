# CivicLens Karnataka — UI/UX Specification

## 1. Design Goal

CivicLens should NOT look like a traditional government website.

It should feel like a modern, trustworthy civic utility that happens to solve a government-service problem.

The experience should be:

* Mobile-first
* Simple
* Visual
* Fast-feeling
* Accessible
* Trustworthy
* Low cognitive load

---

## 2. Brand

### Name

**CivicLens**

### Tagline

**See it. Verify it. Route it. Track it. Get recognized.**

### Primary action

**Take a Photo**

### Secondary actions

* Upload Photo
* Nearby Issues
* My Cases
* My Civic Profile

---

## 3. Navigation

### Desktop

```text
CivicLens

Report
Nearby
My Cases
My Profile
```

### Mobile

Bottom navigation:

```text
Home | Report | Nearby | Cases | Profile
```

---

# SCREEN 01 — HOME

Headline:

> **See a civic problem? Show us.**

Primary button:

> **Take a Photo**

Secondary:

> **Upload Photo**

Cards:

* Nearby Issues
* My Cases
* Civic Profile

Disclosure:

> **Independent prototype • Synthetic civic data**

The first screen must be extremely simple.

---

# SCREEN 02 — CAPTURE / UPLOAD

Large camera/upload area.

Buttons:

> Take Photo

> Upload from Device

> Use Demo Image

Mobile camera should be the dominant action.

---

# SCREEN 03 — AI ANALYSIS

Show uploaded image.

Loading:

> **Analyzing your photo…**

Result:

```text
POTHOLE DETECTED

Confidence
96%

Severity
HIGH

Why?
Large visible road-surface depression
```

Actions:

> Looks right

> Change category

AI disclaimer:

> AI-assisted detection — please confirm.

---

# SCREEN 04 — LOCATION

Show map.

Card:

```text
Is this the correct place?

Demo Main Road
Bengaluru

Ward 42
```

Buttons:

* Confirm Location
* Choose on Map
* Enter Manually
* Use Demo Location

---

# SCREEN 05 — CIVIC INTELLIGENCE

## This is the most important screen.

Headline:

> **We found a related civic record**

Visual chain:

```text
PHOTO
  ↓
ROAD ASSET
  ↓
PROJECT
  ↓
TENDER
  ↓
MAINTENANCE
  ↓
AUTHORITY
```

Show:

### Issue

Pothole

### Asset

ROAD-DEMO-1042

### Road

Demo Main Road

### Ward

Demo Ward 42

### Project

Demo Road Improvement Package

### Tender

DEMO-TND-2025-104

### Contractor

Demo Infrastructure Pvt Ltd.

### Completion

15 March 2025

### Maintenance

24 months

### Simulated status

🟢 ACTIVE

### Authority

Demo Municipal Road Division

Important wording:

> **Relevant project/maintenance information identified for authority review.**

Do NOT say:

> “Responsible officer”

as a personal accusation.

Disclosure:

> **SYNTHETIC DEMO DATA — NOT AN OFFICIAL GOVERNMENT RECORD**

---

# SCREEN 06 — DUPLICATE CHECK

If similar issue exists:

> **This issue may already be reported nearby.**

Show:

```text
Pothole
120m away

Case:
DEMO-CIV-10392

Status:
Under review

Reported:
22 Aug 2026
```

Actions:

> Add My Evidence

> Report Separately

---

# SCREEN 07 — COMPLAINT REVIEW

Headline:

> **Your case is ready**

Editable fields:

* Issue
* Location
* Description
* Evidence
* Project reference
* Requested action

Primary:

> **Submit Demo Case**

Disclosure:

> **Government submission is simulated in this prototype.**

---

# SCREEN 08 — SUBMITTED

Hero:

> **Case submitted**

Reference:

> DEMO-CIV-10482

Destination:

> Demo Municipal Road Division

Show:

* evidence
* location
* project
* timestamp

CTA:

> Track Case

---

# SCREEN 09 — TRACKING

Timeline:

```text
✓ Evidence received

✓ Location confirmed

✓ Asset matched

✓ Case prepared

✓ Routed

🟡 Inspection

○ Repair

○ Resolved
```

Current status explanation:

### What this means

An authority would review the reported issue at the location.

### Do I need to do anything?

No.

This screen should make government-style status language understandable.

---

# SCREEN 10 — NEARBY ISSUES

Map/list view.

Categories:

* Potholes
* Garbage
* Streetlights
* Water
* Drainage
* Footpath
* Fallen trees

Keep the map visually simple.

---

# SCREEN 11 — CIVIC PROFILE

Header:

> **Verified Civic Contributor**

Show:

```text
Verified reports
34

Resolved issues
21

Evidence contributions
48
```

Badges:

* Road Watcher
* Public Safety Contributor
* Clean City Contributor
* Evidence Contributor

No government benefit claims.

---

# SCREEN 12 — SHARE BADGE

Create a polished social card:

```text
CIVICLENS

VERIFIED CIVIC CONTRIBUTOR

Sujal

34 verified contributions
21 resolved issues

🏅 Road Watcher
🏅 Evidence Contributor

Civic contribution since 2026
```

Footer:

> CivicLens recognition. Not a government credential or endorsement.

Allow:

> Share

---

# COMPONENT SYSTEM

Create reusable:

* Button
* Card
* Badge
* StatusPill
* Timeline
* EvidenceCard
* IssueCard
* CivicRecordCard
* ConfidenceIndicator
* DisclosureBanner
* BottomNav
* ShareCard
* MapCard
* StepIndicator

---

# RESPONSIVE DESIGN

### Mobile

Primary target.

Use:

* bottom navigation
* camera-first design
* stacked cards
* large buttons
* sticky primary action
* concise text

### Desktop

Use:

* centered content
* two-column detail screens
* map + information panels

Test:

```text
360px
390px
430px
768px
1440px
```

---

# ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus
* screen-reader labels
* alt text
* high contrast
* large touch targets
* icon + text status
* no color-only meaning

---

# STATES

Design all:

* loading
* success
* error
* retry
* empty
* no asset match
* AI uncertain
* location denied
* duplicate found
* submitted
* resolved

---

# COPY RULES

Prefer:

> Relevant project/maintenance information identified for authority review.

Not:

> This contractor is responsible.

Prefer:

> Simulated maintenance period: ACTIVE.

Not:

> The officer must fix this.

Prefer:

> Government submission is simulated in this prototype.

Not:

> Complaint sent to the government.

---

# UX NORTH STAR

Every screen should answer:

> **“What do I need to do next?”**

The judge should understand within seconds:

> **This is not another complaint form.**
