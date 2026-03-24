import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Winepopper USA",
  description:
    "Read how Winepopper USA collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Privacy Policy
      </h1>

      <p className="text-gray-600 mb-8 text-sm">
        Last updated: March 18, 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Information We Collect
          </h2>
          <p className="mb-3">
            When you visit our site or make a purchase, we may collect the
            following information:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Personal information:</strong> name, email address,
              shipping address, phone number, and billing information.
            </li>
            <li>
              <strong>Account information:</strong> login credentials if you
              create an account.
            </li>
            <li>
              <strong>Device and usage data:</strong> IP address, browser type,
              pages visited, and time spent on site.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Process and fulfill your orders.</li>
            <li>Send order confirmations and shipping updates.</li>
            <li>Respond to your inquiries and provide customer support.</li>
            <li>Improve our website, products, and services.</li>
            <li>
              Send promotional communications (only with your consent; you may
              opt out at any time).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
          <p>
            We use cookies and similar technologies to enhance your browsing
            experience, analyze site traffic, and personalize content. You can
            control cookie preferences through your browser settings. Essential
            cookies required for site functionality cannot be disabled.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Third-Party Sharing
          </h2>
          <p className="mb-3">
            We do not sell your personal information. We may share your data with
            trusted third parties solely for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Payment processing:</strong> to securely process your
              transactions (e.g., Stripe).
            </li>
            <li>
              <strong>Shipping providers:</strong> to deliver your orders.
            </li>
            <li>
              <strong>Analytics:</strong> to understand how our site is used
              (e.g., Google Analytics).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information, including SSL encryption for all data
            transmitted between your browser and our servers. However, no method
            of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            To exercise these rights, please contact us at the email below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:contact@winepopperusa.com"
              className="text-blue-600 hover:underline"
            >
              contact@winepopperusa.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
