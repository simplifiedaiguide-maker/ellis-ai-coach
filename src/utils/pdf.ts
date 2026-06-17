import { SessionData } from '../types/session';

const COLORS = {
  primary: [1, 105, 111] as [number, number, number],
  ink: [40, 37, 29] as [number, number, number],
  muted: [116, 111, 102] as [number, number, number],
};

export const generatePDF = async (sessionData: SessionData): Promise<void> => {
  const { path, snapshot, blocker } = sessionData;

  if (!path) {
    console.error('No path selected');
    return;
  }

  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;

  // Header bar
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageW, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Ellis AI Coach', margin, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Your personalised career brief', margin, 27);

  // Date
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(dateStr, pageW - margin, 27, { align: 'right' });

  let y = 48;

  // Section: About You
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('About You', margin, y);
  y += 6;

  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setTextColor(...COLORS.ink);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const infoRows = [
    ['Current / Recent Role', snapshot.currentRole || '—'],
    ['Target Role', snapshot.targetRole || '—'],
    ['Years of Experience', snapshot.yearsOfExperience || '—'],
    ['Confidence Level', snapshot.confidenceLevel || '—'],
  ];

  for (const [label, value] of infoRows) {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, contentW - 60);
    doc.text(lines, margin + 60, y);
    y += 7 * lines.length;
  }

  y += 6;

  // Section: Your Focus
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Focus', margin, y);
  y += 6;
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  const pathLabels: Record<string, string> = {
    'mock-interview': 'Mock Interview Prep',
    'resume': 'Resume Translation',
    'linkedin': 'LinkedIn Profile Review',
    'strategy': 'Career Clarity & Strategy',
  };

  const blockerLabels: Record<string, string> = {
    'ats-filtering': 'ATS / resume filtering',
    'overqualified-age-bias': 'Overqualified / age bias',
    'interview-nerves': 'Interview nerves',
    'positioning-unclear': 'Unclear positioning / pivot',
  };

  doc.setTextColor(...COLORS.ink);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Path chosen:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(pathLabels[path] || path, margin + 60, y);
  y += 7;

  if (blocker) {
    doc.setFont('helvetica', 'bold');
    doc.text('Top concern:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(blockerLabels[blocker] || blocker, margin + 60, y);
    y += 7;
  }

  y += 6;

  // Section: Your Action Plan
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Action Plan', margin, y);
  y += 6;
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  doc.setTextColor(...COLORS.ink);
  doc.setFontSize(11);

  const actionsByPath: Record<string, string[]> = {
    'mock-interview': [
      'Record a 2-minute answer to: "Walk me through a time you had to learn something completely new on the job."',
      'Listen back and note: clarity, confidence, age-neutral language.',
      'Reframe your story to lead with the outcome, not the timeline.',
      'Practice answering without phrases like "back in my day" or year references before 2010.',
    ],
    'resume': [
      'Replace adjectives with measurable outcomes (numbers, percentages, team sizes).',
      'Remove years before 2005 from your experience section.',
      'Add a strong 2-sentence summary targeting your desired role.',
      'Use exact keywords from 3 job postings you want to apply to.',
    ],
    'linkedin': [
      'Rewrite your headline to reflect your target role, not your current title.',
      'Write a 3-sentence About section: your superpower, one result, one forward-looking sentence.',
      'Add a featured section with your best work or a testimonial.',
      'Engage with 5 posts this week in your target industry.',
    ],
    'strategy': [
      'Write down the 3 roles you are genuinely excited about.',
      'Identify 2 people already in those roles and reach out for a 20-minute conversation.',
      'Define your "signature story" — the one project that shows who you are at your best.',
      'Set a 30-day goal: 10 applications, 5 conversations, 1 offer in pipeline.',
    ],
  };

  const actions = actionsByPath[path] || [];
  for (let i = 0; i < actions.length; i++) {
    const lines = doc.splitTextToSize(`${i + 1}. ${actions[i]}`, contentW - 4);
    doc.setFont('helvetica', 'normal');
    doc.text(lines, margin, y);
    y += 7 * lines.length + 2;
  }

  y += 6;

  // Footer
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(9);
  doc.text('Generated by Ellis AI Coach · ellis-ai-coach.netlify.app', pageW / 2, 285, { align: 'center' });

  const fileName = `Ellis-${path}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
