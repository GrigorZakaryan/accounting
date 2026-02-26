import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="inset-0 absolute w-full h-full flex items-center justify-center gap-3">
      <Spinner /> <span>Genereting PDF...</span>
    </div>
  );
}
