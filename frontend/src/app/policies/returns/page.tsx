import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy | Winepopper USA",
  description:
    "Winepopper USA offers a 30-day return policy. Learn how to return or exchange your wine accessories.",
};

export default function ReturnPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Return Policy
      </h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            30-Day Return Window
          </h2>
          <p>
            We want you to be completely satisfied with your purchase. If you are
            not happy with your order, you may return it within 30 days of
            delivery for a full refund of the product price.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Return Conditions
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Items must be unused and in their original packaging.</li>
            <li>
              All accessories, manuals, and components must be included.
            </li>
            <li>Items that show signs of use or damage are not eligible for return.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            How to Initiate a Return
          </h2>
          <p>
            To start a return, please contact our support team at{" "}
            <a
              href="mailto:contact@winepopperusa.com"
              className="text-blue-600 hover:underline"
            >
              contact@winepopperusa.com
            </a>{" "}
            with your order number and reason for return. We will provide you
            with a return shipping address and instructions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Refunds
          </h2>
          <p>
            Once we receive and inspect your return, your refund will be
            processed within 5&ndash;7 business days. The refund will be issued
            to the original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Non-Refundable Costs
          </h2>
          <p>
            Original shipping costs are non-refundable. Return shipping is the
            responsibility of the customer unless the item is defective.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Defective Items
          </h2>
          <p>
            If you receive a defective item, please contact us immediately. We
            will replace defective products at no additional cost, including
            shipping.
          </p>
        </section>
      </div>
    </main>
  );
}
