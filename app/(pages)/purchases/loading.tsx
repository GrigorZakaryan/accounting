import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <Spinner className="text-primary w-5 h-5" />
    </div>
  );
}
