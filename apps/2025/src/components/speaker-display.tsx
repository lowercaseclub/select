interface SpeakerDisplayProps {
  name: string;
  company?: string;
  title?: string;
}

export function SpeakerDisplay({ name, company, title }: SpeakerDisplayProps) {
  return (
    <div>
      <div className="text-foreground">{name}</div>
      {(company || title) && (
        <div className="text-muted-foreground">
          {[company, title].filter(Boolean).join(", ")}
        </div>
      )}
    </div>
  );
}
