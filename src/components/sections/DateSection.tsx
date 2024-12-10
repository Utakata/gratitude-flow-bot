import { DateSelector } from "@/components/DateSelector";
import { PauseDialog } from "@/components/PauseDialog";

interface DateSectionProps {
  onDateSelect: (date: string) => void;
}

export const DateSection = ({ onDateSelect }: DateSectionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">日付を選択</h2>
        <PauseDialog />
      </div>
      <DateSelector onDateSelect={onDateSelect} />
    </div>
  );
};