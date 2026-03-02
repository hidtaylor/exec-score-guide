import jsPDF from "jspdf";
import type { AssessmentResult, LeadData } from "@/context/AppContext";
import { getBandDescription, QUICKSTART_TIMELINE, CATEGORIES } from "@/lib/scorecard-config";

const CALENDLY_URL = "https://calendly.com/derek-taylor-2/t3-sixty-brokerage-ai-readiness-consultation";

function setColor(doc: jsPDF, r: number, g: number, b: number) {
  doc.setTextColor(r, g, b);
}

export function generateResultsPDF(assessment: AssessmentResult, lead: LeadData | null) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentW = pageW - margin * 2;
  let y = margin;

  // --- Header ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  setColor(doc, 35, 40, 50);
  doc.text("T3 Sixty", margin, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setColor(doc, 100, 105, 115);
  doc.text("AI Readiness Assessment Results", margin, y + 18);
  y += 50;

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
    y += 50;
  }

  // --- Overall Score ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(42);
  setColor(doc, 35, 40, 50);
  doc.text(`${assessment.totalScore}`, margin, y);
  doc.setFontSize(14);
  setColor(doc, 100, 105, 115);
  doc.text("/60", margin + doc.getTextWidth(`${assessment.totalScore}`) + 4, y);
  y += 32;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(doc, 55, 100, 115);
  doc.text(assessment.band.toUpperCase(), margin, y);
  y += 18;

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

  // --- Footer / Contact ---
  if (y > 640) { doc.addPage(); y = margin; }
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  setColor(doc, 35, 40, 50);
  doc.text("Ready to accelerate your AI transformation?", margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setColor(doc, 100, 105, 115);
  doc.text("Derek Taylor  |  VP of Technology Consulting and AI Transformation  |  T3 Sixty", margin, y);
  y += 14;
  doc.text(`Book a 30-min consultation: ${CALENDLY_URL}`, margin, y);

  doc.save("T3-Sixty-AI-Readiness-Results.pdf");
}
