import { Sidebar } from "@/components/sidebar";

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full">
      <Sidebar />
      <div className="w-full h-full max-h-[100dvh] overflow-y-hidden">
        {children}
      </div>
    </div>
  );
}
