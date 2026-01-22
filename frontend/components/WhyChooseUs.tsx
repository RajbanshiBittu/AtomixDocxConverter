import {BoltIcon, LockClosedIcon, ArrowPathIcon, ShieldCheckIcon, CloudIcon, UserIcon, DocumentPlusIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: BoltIcon,
    title: "Lightning Fast",
    description: "Instant document conversion powered by optimized pipelines."

  },
  {
    icon: LockClosedIcon,
    title: "Secure Transfer",
    description: "End-to-end encrypted file handling with zero data leaks."

  },
  {
    icon: ArrowPathIcon,
    title: "Resume & Retry",
    description: "Network failure? Resume uploads without starting over."

  },
  {
    icon: ShieldCheckIcon,
    title: "Privacy First",
    description: "Files auto-deleted after conversion. No tracking."
  },
  {
    icon: CloudIcon,
    title: "Wide Format Compatibility",
    description: "Upload large files without artificial size restrictions."

  },
  {
    icon: UserIcon,
    title: "Zero Sign-Up",
    description: "Convert instantly without creating an account.",
  },
  {
    icon: DocumentPlusIcon,
    title: "High Conversion Accuracy",
    description: "Batch convert multiple documents in one go.",

  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Mobile Friendly",
    description: "Optimized experience across phones, tablets, and desktops."
    
  },
];


export default function WhyChooseUs() {
  return (
    <section className="py-15 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-12 text-black">
        Why Choose Atomix{" "}
        <span className="text-green-600">DocxConverter?</span>
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-4">
        {features.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="border-2 border-gray-200 transition-all hover:shadow-lg hover:border-green-500/50 rounded-lg p-6 bg-white"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Icon className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>

            <p className="text-sm text-gray-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
