import { AdminPage } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  return <AdminPage title="Store settings"><SettingsForm s={await getSettings()} /></AdminPage>;
}
