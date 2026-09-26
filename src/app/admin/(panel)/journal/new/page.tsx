import { AdminPage } from "@/components/admin/ui";
import { PostForm } from "@/components/admin/post-form";

export const metadata = { title: "New post" };

export default function NewPost() {
  return <AdminPage title="New post"><PostForm id={null} initial={{ title: "", slug: "", excerpt: "", coverImage: "", body: "<p></p>", tags: [], published: false }} /></AdminPage>;
}
