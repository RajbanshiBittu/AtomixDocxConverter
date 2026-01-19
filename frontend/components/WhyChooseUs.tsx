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
    title: "No File Limits",
    description: "Upload large files without artificial size restrictions."

  },
  {
    icon: UserIcon,
    title: "Zero Sign-Up",
    description: "Convert instantly without creating an account.",
  },
  {
    icon: DocumentPlusIcon,
    title: "Multiple Files",
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
            className="p-6 rounded-xl text-black bg-white shadow hover:shadow-2xl transition"
          >
            <Icon className="h-10 w-10 text-green-600 mb-4" />

            <h3 className="font-semibold text-lg mb-2">{title}</h3>

            <p className="text-sm text-gray-600">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
