import jsPDF from 'jspdf';
import { RESUME_DATA } from '../data/portfolioData';

export function generateResumePdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 4;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 4;
    }
  };

  const drawSectionHeading = (title: string) => {
    checkPageBreak(12);
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); // #0f172a
    doc.text(title.toUpperCase(), margin, y);
    y += 1.8;
    doc.setDrawColor(203, 213, 225); // #cbd5e1
    doc.setLineWidth(0.35);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  };

  // Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text(RESUME_DATA.name, margin, y);
  y += 5.5;

  // Header: Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105); // #475569
  doc.text(RESUME_DATA.title, margin, y);
  y += 4.5;

  // Contact Info Row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // #64748b
  const contactLine1 = `${RESUME_DATA.email}   •   Telegram: ${RESUME_DATA.telegramHandle}   •   ${RESUME_DATA.location}`;
  doc.text(contactLine1, margin, y);
  y += 3.8;

  const contactLine2 = `GitHub: ${RESUME_DATA.githubDisplay}   •   Itch.io: ${RESUME_DATA.itchDisplay}   •   Portfolio: ${RESUME_DATA.websiteDisplay}`;
  doc.text(contactLine2, margin, y);
  y += 3;

  // CAREER OBJECTIVE
  drawSectionHeading('Career Objective');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(30, 41, 59); // #1e293b
  const objectiveLines = doc.splitTextToSize(RESUME_DATA.careerObjective, contentWidth);
  checkPageBreak(objectiveLines.length * 4);
  doc.text(objectiveLines, margin, y);
  y += objectiveLines.length * 4 + 1;

  // SKILLS
  drawSectionHeading('Skills');
  doc.setFontSize(9.2);

  const renderSkillRow = (label: string, items: string[]) => {
    checkPageBreak(5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const prefix = `${label}: `;
    doc.text(prefix, margin, y);
    const prefixWidth = doc.getTextWidth(prefix);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const itemsText = items.join(', ');
    const itemLines = doc.splitTextToSize(itemsText, contentWidth - prefixWidth);
    doc.text(itemLines, margin + prefixWidth, y);
    y += itemLines.length * 4.2;
  };

  renderSkillRow('Programming', RESUME_DATA.skills.programming);
  renderSkillRow('Engines & Tools', RESUME_DATA.skills.enginesAndTools);
  renderSkillRow('Art & Design', RESUME_DATA.skills.artAndDesign);

  // PROJECTS
  drawSectionHeading('Projects (Unity unless noted)');
  RESUME_DATA.projects.forEach((proj) => {
    checkPageBreak(16);

    // Project Title & Period
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(15, 23, 42);
    doc.text(proj.title, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.8);
    doc.setTextColor(100, 116, 139);
    const periodWidth = doc.getTextWidth(proj.period);
    doc.text(proj.period, pageWidth - margin - periodWidth, y);
    y += 4.2;

    // Bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(30, 41, 59);
    proj.bullets.forEach((bullet) => {
      const bulletLines = doc.splitTextToSize(bullet, contentWidth - 4);
      checkPageBreak(bulletLines.length * 3.8);
      doc.text('•', margin + 1, y);
      doc.text(bulletLines, margin + 4.5, y);
      y += bulletLines.length * 3.8;
    });

    // Links if present
    if (proj.links && proj.links.length > 0) {
      checkPageBreak(4.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.4);
      doc.setTextColor(100, 116, 139);
      doc.text('Link: ', margin + 4.5, y);
      const linkPrefixWidth = doc.getTextWidth('Link: ');

      let currentX = margin + 4.5 + linkPrefixWidth;
      proj.links.forEach((link, idx) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(2, 132, 199); // #0284c7 (Sky/Blue)
        const linkText = `${link.label}${idx < proj.links.length - 1 ? '  |  ' : ''}`;
        const textW = doc.getTextWidth(linkText);
        doc.text(linkText, currentX, y);
        doc.link(currentX, y - 3, textW, 4, { url: link.url });
        currentX += textW;
      });
      y += 4.2;
    }

    y += 1.5;
  });

  // GAME JAMS
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(15, 23, 42);
  doc.text('Game Jams: ', margin, y);
  const jamsPrefixW = doc.getTextWidth('Game Jams: ');

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const jamsText = RESUME_DATA.gameJams.join(' ');
  const jamLines = doc.splitTextToSize(jamsText, contentWidth - jamsPrefixW);
  doc.text(jamLines, margin + jamsPrefixW, y);
  y += jamLines.length * 4.2 + 2;

  // OTHER EXPERIENCE
  drawSectionHeading('Other Experience (Non-Gamedev)');
  RESUME_DATA.experience.forEach((exp) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${exp.role} — ${exp.company}, ${exp.location}`, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.8);
    doc.setTextColor(100, 116, 139);
    const expPeriodW = doc.getTextWidth(exp.period);
    doc.text(exp.period, pageWidth - margin - expPeriodW, y);
    y += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(30, 41, 59);
    exp.bullets.forEach((bullet) => {
      const bLines = doc.splitTextToSize(bullet, contentWidth - 4);
      checkPageBreak(bLines.length * 3.8);
      doc.text('•', margin + 1, y);
      doc.text(bLines, margin + 4.5, y);
      y += bLines.length * 3.8;
    });
    y += 1.5;
  });

  // EDUCATION
  drawSectionHeading('Education');
  checkPageBreak(10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${RESUME_DATA.education.degree}, ${RESUME_DATA.education.institution}`, margin, y);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.8);
  doc.setTextColor(100, 116, 139);
  const eduPeriodW = doc.getTextWidth(RESUME_DATA.education.period);
  doc.text(RESUME_DATA.education.period, pageWidth - margin - eduPeriodW, y);
  y += 6;

  // Save PDF directly
  doc.save(`Resume - ${RESUME_DATA.name.replace(/\s+/g, '_')}.pdf`);
}
