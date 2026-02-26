import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center z-999">
      <Spinner />
    </div>
  );
}
