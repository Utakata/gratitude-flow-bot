import { Button } from "@/components/ui/button";
import { GratitudeEntry } from "@/components/GratitudeEntry";

interface EntriesSectionProps {
  entries: string[];
  onEntryChange: (index: number, value: string) => void;
  onAddEntry: () => void;
}

export const EntriesSection = ({ entries, onEntryChange, onAddEntry }: EntriesSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">感謝の気持ちを記録</h2>
        <Button
          onClick={onAddEntry}
          disabled={entries.length >= 20}
          variant="outline"
          className="text-sm"
        >
          エントリーを追加
        </Button>
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <GratitudeEntry
            key={index}
            index={index + 1}
            value={entry}
            onChange={(value) => onEntryChange(index, value)}
          />
        ))}
      </div>
    </div>
  );
};