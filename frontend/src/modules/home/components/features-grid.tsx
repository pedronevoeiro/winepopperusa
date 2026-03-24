import {
  Zap,
  Wine,
  Shield,
  Leaf,
  Briefcase,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "3 Seconds. Done.",
    description:
      "Blink and you'll miss it. One press, cork's out, wine's ready.",
  },
  {
    icon: Wine,
    title: "Your Wine, Untouched",
    description:
      "The inert gas preserves every note of aroma and flavor. Zero interference.",
  },
  {
    icon: Shield,
    title: "Never Breaks a Cork",
    description:
      "No crumbling, no pieces floating in your glass. The cork comes out whole. Always.",
  },
  {
    icon: Leaf,
    title: "Planet-Friendly Gas",
    description:
      "Ozone-safe, food-grade inert gas. Good for your wine, good for the planet.",
  },
  {
    icon: Briefcase,
    title: "Goes Where You Go",
    description:
      "Vacation house, picnic, friend's dinner — compact enough for any adventure.",
  },
  {
    icon: CheckCircle,
    title: "Any Cork, Any Bottle",
    description:
      "Natural, synthetic, old, new — if it has a cork, the Winepopper handles it.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-14 text-center font-heading text-3xl font-bold text-brand-black md:text-4xl">
          Why Wine Lovers Are Obsessed
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 shadow transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10">
                  <Icon className="h-7 w-7 text-brand-red" />
                </div>

                <h3 className="mb-2 font-heading text-xl font-semibold text-brand-black">
                  {feature.title}
                </h3>

                <p className="font-body leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
