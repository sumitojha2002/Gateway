import { Button } from "@/components/ui/button";

interface Props {
  cv: string;
}

export function Download({ cv }: Props) {
  return (
    <Button asChild variant="brand" className="rounded-none w-full">
      <a href={cv} target="_blank" rel="noopener noreferrer">
        Download CV
      </a>
    </Button>
  );
}
