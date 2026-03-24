import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Winepopper USA",
  description:
    "Review the terms and conditions for using the Winepopper USA website and purchasing our products.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Terms of Service
      </h1>

      <p className="text-gray-600 mb-8 text-sm">
        Last updated: March 18, 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            General Terms
          </h2>
          <p>
            By accessing and using the Winepopper USA website
            (winepopperusa.com), you agree to be bound by these Terms of
            Service. If you do not agree with any part of these terms, please do
            not use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Products
          </h2>
          <p>
            We strive to display our products as accurately as possible. However,
            colors and appearance may vary slightly due to monitor settings and
            photography. We reserve the right to discontinue any product at any
            time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Pricing
          </h2>
          <p>
            All prices are listed in US Dollars (USD) and are subject to change
            without prior notice. We are not responsible for typographical errors
            in pricing. If a product is listed at an incorrect price, we reserve
            the right to cancel orders placed at the incorrect price.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Orders</h2>
          <p>
            By placing an order, you represent that you are at least 18 years of
            age. We reserve the right to refuse or cancel any order for any
            reason, including suspected fraud or unauthorized transactions. An
            order confirmation email does not constitute acceptance of your
            order.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Shipping
          </h2>
          <p>
            Shipping times and costs are estimates and may vary. Winepopper USA
            is not responsible for delays caused by shipping carriers, weather,
            or other circumstances beyond our control. Please review our{" "}
            <a
              href="/policies/shipping"
              className="text-blue-600 hover:underline"
            >
              Shipping Policy
            </a>{" "}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Returns and Refunds
          </h2>
          <p>
            Returns and refunds are subject to our{" "}
            <a
              href="/policies/returns"
              className="text-blue-600 hover:underline"
            >
              Return Policy
            </a>
            . Please review it carefully before making a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Limitation of Liability
          </h2>
          <p>
            Winepopper USA shall not be liable for any indirect, incidental,
            special, or consequential damages arising from your use of our
            website or products. Our total liability shall not exceed the amount
            you paid for the product in question. Products are intended for use
            as directed; we are not responsible for damages resulting from
            misuse.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Intellectual Property
          </h2>
          <p>
            All content on this website, including text, images, logos, and
            graphics, is the property of Winepopper USA and is protected by
            applicable intellectual property laws. You may not reproduce,
            distribute, or create derivative works without our written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Governing Law
          </h2>
          <p>
            These terms shall be governed by and construed in accordance with the
            laws of the State of Maryland, United States, without regard to
            conflict of law principles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Contact
          </h2>
          <p>
            For questions about these Terms of Service, please contact us at{" "}
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
