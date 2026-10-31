import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy | Nori",
  description: "What Nori stores, what it reads, who it shares it with, and how to take it back.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      intro="What Nori stores, what it reads, who it shares it with, and how to take it back."
      updated="October 2026"
      sections={[
        {
          heading: "What Nori stores",
          paragraphs: [
            "Your resume and the career graph built from it: roles, projects, skills, results and education.",
            "Your preferences: titles, locations, remote, minimum match, daily cap and any companies you exclude.",
            "The roles Nori found for you, the resumes it tailored, and the applications you approved or skipped.",
          ],
        },
        {
          heading: "Your email",
          paragraphs: [
            "Only if you connect Gmail. Every 5 minutes Nori looks at up to 50 recent messages from the last 3 days to find recruiter replies, interview requests, offers, rejections and verification codes, and updates the matching application.",
          ],
        },
        {
          heading: "Services Nori uses",
          paragraphs: [
            "Connections to Gmail and Slack go through Composio. Web job search and company research use Parallel.",
            "To tailor a resume, Nori sends the relevant parts of your career graph and the job description to the language model you choose.",
          ],
        },
        {
          heading: "Your control",
          paragraphs: [
            "You can export your career graph as JSON at any time. Closing your account stops all searching and applying.",
          ],
        },
      ]}
    />
  );
}
