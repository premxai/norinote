import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms | Nori",
  description: "The ground rules for using Nori.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      intro="The ground rules for using Nori."
      updated="October 2026"
      sections={[
        {
          heading: "The service",
          paragraphs: [
            "Nori finds roles, tailors resumes from facts you provide, and fills applications. By default it waits for your approval before submitting anything.",
          ],
        },
        {
          heading: "Your responsibilities",
          paragraphs: [
            "You are responsible for the accuracy of the facts you give Nori and for every application you approve. Follow the terms of the job boards and employers you apply to.",
          ],
        },
        {
          heading: "Billing",
          paragraphs: ["Paid plans are billed monthly and you can cancel anytime. The Starter plan is free."],
        },
        {
          heading: "No guarantees",
          paragraphs: ["Nori cannot promise interviews or offers. Hiring decisions belong to employers."],
        },
      ]}
    />
  );
}
