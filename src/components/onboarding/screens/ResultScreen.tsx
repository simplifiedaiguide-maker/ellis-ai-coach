import React, { useState } from 'react';
import { SessionData, BlockerType, SessionPath } from '../../../types/session';
import { generatePDF } from '../../../utils/pdf';
import { subscribeToMailerLite } from '../../../utils/mailerlite';
import { Button } from '../shared/Button';
import { TextInput } from '../shared/TextInput';
import { ProgressBar } from '../shared/ProgressBar';
import './ResultScreen.css';

interface ResultScreenProps {
  sessionData: SessionData;
  onContinue: () => void;
}

interface ResultContent {
  title: string;
  subtitle: string;
  resultText: React.ReactNode;
}

function yearsPhrase(raw: string): string {
  const trimmed = raw.trim();
  return /year/i.test(trimmed) ? trimmed : `${trimmed} years`;
}

function getMockInterviewContent(
  currentRole: string,
  targetRole: string,
  blocker: BlockerType | null,
): ResultContent {
  const questionsByBlocker: Record<BlockerType, { question: string; why: string }> = {
    'overqualified-age-bias': {
      question: `"What excites you most about stepping into a ${targetRole} role at this stage of your career?"`,
      why: `This disarms the "why would you want this?" assumption. Your answer reframes experience as intentional, not a fallback — and signals energy, not desperation.`,
    },
    'interview-nerves': {
      question: `"Tell me about a time you had to make a high-stakes decision without all the information you needed."`,
      why: `This plays to your strength. ${currentRole} experience means you've done this dozens of times. Record a 2-minute answer and listen back — you'll hear yourself get more confident as you tell the real story.`,
    },
    'ats-filtering': {
      question: `"Walk me through how you've adapted your approach as your industry changed over the years."`,
      why: `ATS filters you out before the interview — but once you're in the room, this question proves you're current, not legacy. It neutralises the "too old to adapt" fear before they ask it.`,
    },
    'positioning-unclear': {
      question: `"If you had to describe the thread that runs through your whole career in one sentence, what would it be?"`,
      why: `For career pivots or scattered backgrounds, this is the question that unlocks your story. Practise it until the answer feels obvious — because once it does, every other interview question gets easier.`,
    },
  };

  const fallback = {
    question: `"Walk me through a time you had to learn something completely new on the job. How did you approach it?"`,
    why: `This addresses the 'can you still learn?' concern that comes up with experienced professionals. Your answer proves you're curious, not stuck.`,
  };

  const { question, why } = (blocker && questionsByBlocker[blocker]) || fallback;

  return {
    title: "Here's your practice question.",
    subtitle: `Tailored for ${currentRole} → ${targetRole}:`,
    resultText: (
      <>
        <p>
          <strong>Record a 2-minute answer to this question,</strong> then listen
          back. Notice your pace, your confidence, and whether you lead with the
          outcome or bury it at the end.
        </p>
        <blockquote className="question">{question}</blockquote>
        <p className="explanation">{why}</p>
      </>
    ),
  };
}

function getResumeContent(
  currentRole: string,
  targetRole: string,
  rawYears: string,
  blocker: BlockerType | null,
): ResultContent {
  const yrs = yearsPhrase(rawYears);

  const afterByBlocker: Record<BlockerType, { after: string; explanation: string }> = {
    'ats-filtering': {
      after: `${currentRole} with ${yrs} of experience. Skilled in [insert 2–3 keywords directly from the job posting]. Proven track record of [specific outcome] — now targeting ${targetRole} roles where that same focus drives results.`,
      explanation: `ATS ranks resumes by keyword density. The brackets are intentional — swap them for exact phrases from each job ad you apply to. One tailored summary beats ten generic ones.`,
    },
    'overqualified-age-bias': {
      after: `${currentRole} transitioning into ${targetRole}. ${yrs} of experience building the judgment, relationships, and systems that matter most in this role — without the learning curve. Here to contribute, not coast.`,
      explanation: `"Overqualified" is fear of attitude, not skills. This copy pre-empts it. You're not settling — you're choosing. That reframe has to be in the first two lines or it won't land.`,
    },
    'interview-nerves': {
      after: `${currentRole} with ${yrs} of experience delivering results under pressure. Known for staying clear-headed when stakes are high and teams need direction. Now bringing that steadiness to ${targetRole}.`,
      explanation: `Nerves in interviews often come from underselling on paper first. This summary signals composure before you walk in the door — which sets a different tone for the whole conversation.`,
    },
    'positioning-unclear': {
      after: `${currentRole} with ${yrs} of experience across [2–3 industries or functions]. The common thread: [your one-line superpower]. Now channelling that into ${targetRole} — where it's needed most.`,
      explanation: `A scattered background looks like indecision until you name the pattern. Fill in the brackets honestly. The sentence that connects your dots is the most valuable line on your resume.`,
    },
  };

  const fallback = {
    after: `${currentRole} with ${yrs} of experience driving results in complex environments. Known for turning ambiguity into clear action — and following through. Now bringing that capability to ${targetRole}.`,
    explanation: `The "before" leads with your title and tenure. The "after" leads with what you do and the result. Age markers are gone. You sound like judgment, not years on a clock.`,
  };

  const { after, explanation } = (blocker && afterByBlocker[blocker]) || fallback;
  const before = `Experienced ${currentRole} with ${yrs} of experience, looking for a ${targetRole} position.`;

  return {
    title: "Here's your resume summary rewrite.",
    subtitle: `Targeted for ${targetRole}:`,
    resultText: (
      <>
        <p><strong>Before (what most people write):</strong></p>
        <p className="before-example">"{before}"</p>
        <p><strong>After (paste this at the top of your resume):</strong></p>
        <p className="after-example">"{after}"</p>
        <p className="explanation">{explanation}</p>
      </>
    ),
  };
}

function getLinkedInContent(
  currentRole: string,
  targetRole: string,
  rawYears: string,
  blocker: BlockerType | null,
): ResultContent {
  const yrs = yearsPhrase(rawYears);

  const headlinesByBlocker: Record<BlockerType, { headline: string; tip: string }> = {
    'ats-filtering': {
      headline: `${targetRole} | [Industry keyword] | [Industry keyword] | Open to opportunities`,
      tip: `LinkedIn's algorithm ranks profiles by keyword match. Your headline is the most indexed field. Use the exact job titles and skills that appear in roles you're applying to — not your current title.`,
    },
    'overqualified-age-bias': {
      headline: `${currentRole} → ${targetRole} | ${yrs} of experience, focused on what's next`,
      tip: `The arrow signals direction, not desperation. "Focused on what's next" tells recruiters you're intentional. Remove graduation years and early-career dates from your profile — they're irrelevant and age-flagging.`,
    },
    'interview-nerves': {
      headline: `${targetRole} | ${currentRole} background | Results-driven | Open to work`,
      tip: `Your LinkedIn headline is your cold open. Lead with where you're going, not where you've been. A calm, direct headline sets the tone — you're not anxious about the transition, you're ready for it.`,
    },
    'positioning-unclear': {
      headline: `[Your core skill] specialist | ${currentRole} → ${targetRole} | ${yrs} of experience`,
      tip: `The bracket is the most important part. What's the one thing you're known for across every role you've had? That goes first. Once you name it, your whole profile starts to make sense to a stranger.`,
    },
  };

  const fallback = {
    headline: `${currentRole} | Transitioning to ${targetRole} | ${yrs} of experience | Open to opportunities`,
    tip: `Most people write their current title and stop. A strong headline tells a recruiter where you're going and why it makes sense — in under 12 words.`,
  };

  const { headline, tip } = (blocker && headlinesByBlocker[blocker]) || fallback;

  return {
    title: "Here's your LinkedIn headline rewrite.",
    subtitle: `For your profile:`,
    resultText: (
      <>
        <p><strong>Before (what yours probably says):</strong></p>
        <p className="before-example">"{currentRole} at [Company]"</p>
        <p><strong>After (paste this as your headline):</strong></p>
        <p className="after-example">"{headline}"</p>
        <p className="explanation">{tip}</p>
      </>
    ),
  };
}

function getStrategyContent(
  currentRole: string,
  targetRole: string,
  blocker: BlockerType | null,
): ResultContent {
  const stepsByBlocker: Record<BlockerType, { focus: string; steps: string[] }> = {
    'ats-filtering': {
      focus: `Your resume isn't getting seen. Fix that first — everything else follows.`,
      steps: [
        `Pull 3 job postings for ${targetRole} roles. Highlight every skill and phrase that appears in 2 or more of them.`,
        `Add those exact phrases to your resume summary and skills section — word for word, not paraphrased.`,
        `Run your resume through a free ATS checker (Jobscan or Resume Worded) before sending anything.`,
        `Apply to 5 roles this week using the updated version. Track which ones get responses.`,
      ],
    },
    'overqualified-age-bias': {
      focus: `You're not being filtered out for being too good. You're being filtered out for not addressing the concern directly.`,
      steps: [
        `Rewrite your resume summary to lead with your target role, not your current title. Signal direction.`,
        `Remove any experience older than 15 years. It's not hiding anything — it's focusing the narrative.`,
        `In cover letters, add one sentence that acknowledges the transition: "I'm making this move because [honest reason]."`,
        `Target companies with older leadership teams or stated DE&I commitments — they self-select for this.`,
      ],
    },
    'interview-nerves': {
      focus: `Nerves come from feeling unprepared. The fix is repetition, not pep talks.`,
      steps: [
        `Write out answers to these 3 questions: "Tell me about yourself." "Why this role?" "Why now?" — in writing first, then out loud.`,
        `Record yourself answering each one. Watch it back once. You'll fix 80% of your habits just by seeing them.`,
        `Do one mock interview this week — with a friend, a coach, or even just talking to a camera.`,
        `Before every real interview: write down the 3 things you most want them to know about you. That's your anchor.`,
      ],
    },
    'positioning-unclear': {
      focus: `You don't have a background problem. You have a narrative problem. Fix the story.`,
      steps: [
        `Write one sentence that connects every job you've ever had: "Across all my roles, I've always been the person who ___."`,
        `That sentence goes at the top of your resume, your LinkedIn, and into every interview answer.`,
        `Identify 2 people already doing the ${targetRole} role you want. Reach out for a 20-minute conversation — not to ask for a job, to understand how they got there.`,
        `Pick a lane for the next 90 days. A scattered search gets scattered results. One clear target gets traction.`,
      ],
    },
  };

  const fallback = {
    focus: `You've done the hard part — you know what you want. Now build the plan to get there.`,
    steps: [
      `Define your target clearly: what specific ${targetRole} roles, in what industries, at what size of company?`,
      `Update your resume summary to reflect where you're going, not just where you've been.`,
      `Identify 3 people in your network connected to ${targetRole} roles and reach out this week.`,
      `Set a 30-day goal: 10 applications, 5 conversations, 1 offer in pipeline.`,
    ],
  };

  const { focus, steps } = (blocker && stepsByBlocker[blocker]) || fallback;

  return {
    title: "Here's your 30-day plan.",
    subtitle: `From ${currentRole} to ${targetRole}:`,
    resultText: (
      <>
        <p><strong>{focus}</strong></p>
        <ol className="strategy-steps">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </>
    ),
  };
}

function getResultContent(sessionData: SessionData): ResultContent {
  const { path, snapshot, blocker } = sessionData;
  const { currentRole, targetRole, yearsOfExperience } = snapshot;

  const contentByPath: Record<SessionPath, () => ResultContent> = {
    'mock-interview': () => getMockInterviewContent(currentRole, targetRole, blocker),
    'resume': () => getResumeContent(currentRole, targetRole, yearsOfExperience, blocker),
    'linkedin': () => getLinkedInContent(currentRole, targetRole, yearsOfExperience, blocker),
    'strategy': () => getStrategyContent(currentRole, targetRole, blocker),
  };

  return path
    ? contentByPath[path]()
    : {
        title: "Here's your brief.",
        subtitle: `Your next steps toward ${targetRole}:`,
        resultText: <p>Export your PDF to take your plan with you.</p>,
      };
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  sessionData,
  onContinue,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExportPDF = async () => {
    try {
      await generatePDF(sessionData);
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const validateEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleContinue = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await subscribeToMailerLite({ email: email.trim(), name: '', sessionData });
      setSuccess(true);
      setTimeout(() => onContinue(), 2000);
    } catch (err) {
      console.error('Subscription failed:', err);
      setError('We had trouble subscribing you. Please try again or email hello@rebrandrise.com.');
      setIsLoading(false);
    }
  };

  const content = getResultContent(sessionData);

  return (
    <div className="screen result-screen">
      <div className="screen-content">
        <h2>{content.title}</h2>
        <p className="subtext">{content.subtitle}</p>

        <div className="result-box">
          {content.resultText}
        </div>

        {!success && (
          <>
            <p className="follow-up">
              After you try this, come back and we'll build out your full interview
              prep, resume strategy, or LinkedIn refresh. Your choice.
            </p>

            <div className="email-section">
              <h3>Stay connected with Ellis</h3>
              <p className="email-hint">
                Get more tips, session results, and updates delivered to your inbox.
              </p>
              <TextInput
                label="Your email"
                placeholder="you@example.com"
                value={email}
                onChange={setEmail}
                type="email"
              />
              {error && <p className="error-message">{error}</p>}
            </div>
          </>
        )}

        {success && (
          <div className="success-message">
            <p>
              <strong>✓ You're in!</strong> Check your email for your results and
              next steps. Welcome to Ellis.
            </p>
          </div>
        )}
      </div>

      <div className="screen-actions">
        <Button onClick={handleExportPDF} variant="primary">
          Export as PDF
        </Button>
        {!success && (
          <Button
            onClick={handleContinue}
            variant="secondary"
            disabled={isLoading || !email.trim()}
          >
            {isLoading ? 'Subscribing...' : 'Continue with Ellis'}
          </Button>
        )}
        {success && (
          <Button onClick={onContinue} variant="secondary">
            Next
          </Button>
        )}
      </div>

      <ProgressBar current={5} />
    </div>
  );
};
