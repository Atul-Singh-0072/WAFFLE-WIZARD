import { ArrowRight, MapPin } from "lucide-react";
import { LogoMark } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark heightClass="h-24 md:h-28" sizes="(min-width: 768px) 170px, 140px" />
      <p className="eyebrow mt-8 text-accent">404</p>
      <h1 className="display-lg mt-2 text-text">That page went up in smoke.</h1>
      <p className="mt-4 max-w-md text-muted">
        The link may be old, or the item may have moved. The menu and the store locator are the quickest way back.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/menu" size="lg" iconRight={<ArrowRight className="size-4" />}>
          Browse the menu
        </Button>
        <Button href="/stores" size="lg" variant="outline" iconLeft={<MapPin className="size-4" />}>
          Find a store
        </Button>
      </div>
    </div>
  );
}
