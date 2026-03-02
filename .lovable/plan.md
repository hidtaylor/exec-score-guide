

## Downloadable Results + Contact CTA with QR Code

### Overview
Replace the current CTA block at the bottom of the Results page with three things:
1. A **"Download Your Results"** button that generates a PDF of the user's personalized assessment
2. A **contact call-to-action** featuring Derek Taylor, VP of Technology Consulting and AI Transformation at T3 Sixty
3. A **QR code** linking to the 30-minute consultation booking page

### Changes

**1. Install `jspdf` for client-side PDF generation**
- Add `jspdf` as a dependency (lightweight, no server needed)

**2. Create `src/lib/generate-results-pdf.ts`**
- A utility function that takes the assessment data (score, band, category scores, recommendations, 90-day plan) and the lead's name/brokerage
- Builds a clean, branded PDF using jsPDF with:
  - T3 Sixty header
  - Overall score and band
  - Category score breakdown
  - Top 3 recommendations
  - 90-day action plan
  - Contact info and Calendly link at the bottom
- Returns a downloadable blob

**3. Create `src/components/QRCode.tsx`**
- A small component that renders a QR code as an inline SVG
- Uses a lightweight QR code generation approach (install `qrcode` package or use a minimal encoder)
- Encodes the Calendly URL: `https://calendly.com/derek-taylor-2/t3-sixty-brokerage-ai-readiness-consultation`

**4. Update `src/pages/Results.tsx`**
- Replace the existing CTA block with a redesigned section containing:
  - **Download button** -- calls `generateResultsPDF()` and triggers a browser download
  - **Contact card** with:
    - Name: Derek Taylor
    - Title: VP of Technology Consulting and AI Transformation
    - Company: T3 Sixty
    - Email: derek.taylor@t3sixty.com
    - "Book Consultation" button linking to /thanks
  - **QR code** rendered next to the contact info, scanning to the Calendly link
  - Caption under QR: "Scan to schedule a 30-min consultation"

### Technical Details

- **PDF generation** uses `jspdf` (pure JS, no canvas/DOM capture needed) for fast, reliable output
- **QR code** will use the `qrcode` npm package with SVG output for crisp rendering at any size
- The download button will show a brief loading state while the PDF generates
- PDF filename format: `T3-Sixty-AI-Readiness-Results.pdf`
- The existing "Download Report (PDF)" link (which points to a non-existent `/quickstart-kit.pdf`) will be replaced by the functional PDF generator

