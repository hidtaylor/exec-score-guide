import jsPDF from "jspdf";
import type { AssessmentResult, LeadData } from "@/context/AppContext";
import calendlyQrImg from "@/assets/calendly-qr.jpg";
import { getBandDescription, QUICKSTART_TIMELINE, CATEGORIES } from "@/lib/scorecard-config";

const CALENDLY_URL = "https://calendly.com/derek-taylor-2/t3-sixty-brokerage-ai-readiness-consultation";

function setColor(doc: jsPDF, r: number, g: number, b: number) {
  doc.setTextColor(r, g, b);
}

/**
 * Pre-load an image and return its base64 data URL.
 */
function loadImageAsDataUrl(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas ctx"));
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

export async function generateResultsPDF(assessment: AssessmentResult, lead: LeadData | null) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentW = pageW - margin * 2;
  let y = margin;

  // --- Header with logo ---
  try {
    const logoDataUrl = await loadImageAsDataUrl(t360Logo);
    const logoH = 36;
    const logoW = 36;
    doc.addImage(logoDataUrl, "WEBP", margin, y - logoH + 8, logoW, logoH);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(doc, 100, 105, 115);
    doc.text("AI Readiness Assessment Results", margin + logoW + 10, y);
    y += 50;
  } catch {
    // Fallback to text if logo fails
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    setColor(doc, 35, 40, 50);
    doc.text("T3 Sixty", margin, y);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    setColor(doc, 100, 105, 115);
    doc.text("AI Readiness Assessment Results", margin, y + 18);
    y += 50;
  }

  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageW - margin, y);
  y += 25;

  // --- Lead info ---
  if (lead) {
    doc.setFontSize(10);
    setColor(doc, 100, 105, 115);
    doc.text(`Prepared for: ${lead.firstName} ${lead.lastName}`, margin, y);
    doc.text(`Brokerage: ${lead.brokerageName}`, margin, y + 14);
    doc.text(`Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, margin, y + 28);

    // Add extra buffer after the date so the large score never overlaps it
    y += 66;
  }

  // --- Overall Score ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  setColor(doc, 35, 40, 50);
  doc.text(`${assessment.totalScore}`, margin, y);

  // Place "/60" right after the score on the same baseline
  const scoreTextW = doc.getTextWidth(`${assessment.totalScore}`);
  doc.setFontSize(14);
  setColor(doc, 100, 105, 115);
  doc.text("/60", margin + scoreTextW + 4, y);

  // Move down well past the large score text
  y += 40;

  // Band label
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(doc, 55, 100, 115);
  doc.text(assessment.band.toUpperCase(), margin, y);
  y += 18;

  // Band description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(doc, 100, 105, 115);
  const bandDesc = getBandDescription(assessment.band);
  const bandLines = doc.splitTextToSize(bandDesc, contentW);
  doc.text(bandLines, margin, y);
  y += bandLines.length * 12 + 16;

  // --- Category Scores ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor(doc, 35, 40, 50);
  doc.text("CATEGORY SCORES", margin, y);
  y += 18;

  const catW = contentW / CATEGORIES.length;
  CATEGORIES.forEach((cat, i) => {
    const score = assessment.categoryScores[cat] || 0;
    const x = margin + i * catW;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    setColor(doc, 35, 40, 50);
    doc.text(score.toFixed(1), x + catW / 2, y, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setColor(doc, 100, 105, 115);
    doc.text(cat, x + catW / 2, y + 14, { align: "center" });
  });
  y += 40;

  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // --- Recommendations ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor(doc, 35, 40, 50);
  doc.text("TOP 3 PRIORITIES", margin, y);
  y += 18;

  assessment.recommendations.forEach((rec, i) => {
    if (y > 660) { doc.addPage(); y = margin; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(doc, 55, 100, 115);
    doc.text(`${String(i + 1).padStart(2, "0")}`, margin, y);
    setColor(doc, 35, 40, 50);
    doc.text(rec.title, margin + 24, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(doc, 100, 105, 115);
    const lines = doc.splitTextToSize(rec.description, contentW - 24);
    doc.text(lines, margin + 24, y);
    y += lines.length * 12 + 12;
  });

  // --- 90-Day Plan ---
  if (y > 520) { doc.addPage(); y = margin; }
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor(doc, 35, 40, 50);
  doc.text("90-DAY ACTION PLAN", margin, y);
  y += 20;

  QUICKSTART_TIMELINE.forEach((phase) => {
    if (y > 620) { doc.addPage(); y = margin; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    setColor(doc, 55, 100, 115);
    doc.text(phase.phase.toUpperCase(), margin, y);
    setColor(doc, 35, 40, 50);
    doc.setFontSize(10);
    doc.text(phase.title, margin + 70, y);
    y += 14;

    phase.actions.forEach((action) => {
      if (y > 700) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      setColor(doc, 100, 105, 115);
      const lines = doc.splitTextToSize(`—  ${action}`, contentW - 70);
      doc.text(lines, margin + 70, y);
      y += lines.length * 11;
    });
    y += 10;
  });

  // --- Footer / Contact with QR ---
  if (y > 560) { doc.addPage(); y = margin; }
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  const qrSize = 100;
  const textX = margin;
  const qrX = pageW - margin - qrSize;
  const footerStartY = y;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(doc, 35, 40, 50);
  doc.text("Ready to accelerate your AI transformation?", textX, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(doc, 100, 105, 115);
  doc.text("Derek Taylor", textX, y);
  y += 12;
  doc.text("VP of Technology Consulting and AI Transformation", textX, y);
  y += 12;
  doc.text("T3 Sixty", textX, y);
  y += 16;
  doc.text("derek.taylor@t3sixty.com", textX, y);
  y += 12;
  doc.setFontSize(8);
  doc.text(`Book a 30-min consultation: ${CALENDLY_URL}`, textX, y);

  // Add QR code image
  try {
    const qrDataUrl = await loadImageAsDataUrl(calendlyQrImg);
    doc.addImage(qrDataUrl, "JPEG", qrX, footerStartY, qrSize, qrSize);
    doc.setFontSize(7);
    setColor(doc, 130, 130, 130);
    doc.text("Scan to schedule", qrX + qrSize / 2, footerStartY + qrSize + 10, { align: "center" });
  } catch {
    // QR image failed to load — skip silently
  }

  doc.save("T3-Sixty-AI-Readiness-Results.pdf");
}
