import { MessageCircle } from 'lucide-react';

const whatsappUrl = 'https://wa.me/919039220991?text=Hello%20BranEco%2C%20I%27d%20like%20to%20know%20more%20about%20your%20products.';

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with BranEco on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#188b45] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#188b45]/25 transition hover:-translate-y-1 hover:bg-[#116c35]"
    >
      <MessageCircle size={19} aria-hidden="true" />
      WhatsApp us
    </a>
  );
}