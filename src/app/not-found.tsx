import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <Wordmark />
      <p className="mt-16 font-serif text-[120px] leading-none text-gold md:text-[180px]">404</p>
      <h1 className="mt-4 font-serif text-3xl md:text-4xl">This page has wandered off</h1>
      <p className="mt-4 max-w-md text-sm text-warm-dark">The piece you&apos;re looking for may have sold out or moved. Let us help you find something beautiful.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild><Link href="/">Return home</Link></Button>
        <Button asChild variant="outline"><Link href="/shop">Shop the collection</Link></Button>
      </div>
    </main>
  );
}
