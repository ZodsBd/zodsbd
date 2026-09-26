export function WhatsAppFab({ number }: { number: string }) {
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent("Hello Zod's Bd, I have a question.")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 lg:bottom-6 lg:right-6">
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M16.04 3C8.88 3 3.06 8.8 3.06 15.95c0 2.28.6 4.51 1.74 6.47L3 29l6.76-1.77a12.95 12.95 0 0 0 6.28 1.6h.01c7.15 0 12.97-5.8 12.97-12.95C29.02 8.8 23.2 3 16.04 3Zm0 23.64h-.01a10.8 10.8 0 0 1-5.5-1.5l-.4-.23-4.01 1.05 1.07-3.9-.26-.4a10.7 10.7 0 0 1-1.65-5.72c0-5.94 4.84-10.77 10.78-10.77 5.93 0 10.76 4.83 10.76 10.77 0 5.94-4.84 10.7-10.78 10.7Zm5.9-8.05c-.32-.16-1.91-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.26-.19.22-.37.24-.7.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.9-1.8-2.22-.18-.32-.02-.5.15-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.54.1-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.63-.53-.54-.73-.55h-.62c-.21 0-.56.08-.86.4-.3.32-1.13 1.1-1.13 2.69 0 1.58 1.16 3.12 1.32 3.33.16.22 2.28 3.47 5.52 4.87.77.33 1.37.53 1.84.68.77.24 1.48.21 2.03.13.62-.09 1.91-.78 2.18-1.53.27-.75.27-1.4.19-1.53-.08-.13-.3-.21-.62-.37Z" />
      </svg>
    </a>
  );
}
