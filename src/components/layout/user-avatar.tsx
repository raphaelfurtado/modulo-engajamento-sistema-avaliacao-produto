import Image from "next/image";
import { cn } from "@/lib/utils";

/** Avatar Dicebear (traço desenhado à mão) em um círculo de 36px. */
export function UserAvatar({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={36}
      height={36}
      // SVG externo: sem otimização (next.config já libera api.dicebear.com).
      unoptimized
      className={cn(
        "size-9 shrink-0 rounded-full bg-secondary ring-1 ring-border",
        className,
      )}
    />
  );
}
