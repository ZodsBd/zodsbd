"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import type { StoreSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Card } from "./ui";
import { saveSettings } from "@/actions/content";

export function SettingsForm({ s }: { s: StoreSettings }) {
  const [pending, start] = useTransition();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    start(async () => { const r = await saveSettings(data); if (!r.ok) toast.error(r.error); else toast.success("Settings saved"); });
  };
  const F = ({ name, label, type = "text", value, placeholder }: { name: keyof StoreSettings; label: string; type?: string; value: string | number | null; placeholder?: string }) => (
    <Field label={label} htmlFor={`s-${name}`}><Input id={`s-${name}`} name={name} type={type} defaultValue={value ?? ""} placeholder={placeholder} /></Field>
  );
  return (
    <form onSubmit={submit} className="grid max-w-4xl gap-4">
      <Card title="Shipping rates (৳, flat per order)">
        <div className="grid gap-4 sm:grid-cols-3">
          <F name="shippingInsideDhaka" label="Inside Dhaka" type="number" value={s.shippingInsideDhaka} />
          <F name="shippingSubDhaka" label="Dhaka Sub-urban" type="number" value={s.shippingSubDhaka} />
          <F name="shippingOutsideDhaka" label="Outside Dhaka" type="number" value={s.shippingOutsideDhaka} />
        </div>
      </Card>
      <Card title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <F name="whatsappNumber" label="WhatsApp number (with 880, digits only)" value={s.whatsappNumber} placeholder="8801XXXXXXXXX" />
          <F name="contactPhone" label="Phone" value={s.contactPhone} placeholder="+880 1XXX-XXXXXX" />
          <F name="contactEmail" label="Email" type="email" value={s.contactEmail} />
          <Field label="Address" htmlFor="s-address" className="sm:col-span-2"><Textarea id="s-address" name="address" rows={2} defaultValue={s.address ?? ""} /></Field>
        </div>
      </Card>
      <Card title="Social links">
        <div className="grid gap-4 sm:grid-cols-2">
          <F name="facebookUrl" label="Facebook URL" value={s.facebookUrl} placeholder="https://facebook.com/…" />
          <F name="instagramUrl" label="Instagram URL" value={s.instagramUrl} placeholder="https://instagram.com/…" />
          <F name="tiktokUrl" label="TikTok URL" value={s.tiktokUrl} />
          <F name="youtubeUrl" label="YouTube URL" value={s.youtubeUrl} />
        </div>
      </Card>
      <Button type="submit" disabled={pending} className="w-fit">{pending ? "Saving…" : "Save settings"}</Button>
    </form>
  );
}
