import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Winepopper USA",
  description:
    "Learn about Winepopper USA shipping options, delivery times, and free shipping on orders over $50.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Shipping Policy
      </h1>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Shipping Options
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900">Standard Shipping</p>
              <p>$5.99 &mdash; Delivered in 5&ndash;7 business days.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="font-medium text-gray-900">Express Shipping</p>
              <p>$12.99 &mdash; Delivered in 2&ndash;3 business days.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-green-50 border-green-200">
              <p className="font-medium text-gray-900">Free Shipping</p>
              <p>On all orders over $50.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Shipping Coverage
          </h2>
          <p>
            We ship to all 50 US states. At this time, we do not offer
            international shipping.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Processing Time
          </h2>
          <p>
            Orders are processed within 1&ndash;2 business days. Orders placed
            on weekends or holidays will be processed on the next business day.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Order Tracking
          </h2>
          <p>
            Once your order has shipped, you will receive a confirmation email
            with a tracking number so you can follow your package every step of
            the way.
          </p>
        </section>
      </div>
    </main>
  );
}
