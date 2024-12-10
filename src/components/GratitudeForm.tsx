import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DateSelector } from "./DateSelector";
import { GratitudeEntry } from "./GratitudeEntry";
import { validateGratitudeEntry, formatEntry } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { PauseDialog } from "./PauseDialog";

export const GratitudeForm = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [entries, setEntries] = useState<string[]>([""]);
  const { toast } = useToast();

  const addEntry = () => {
    if (entries.length < 20) {
      setEntries([...entries, ""]);
    }
  };

  const updateEntry = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    const filledEntries = entries.filter((entry) => entry.trim());
    
    if (!selectedDate) {
      toast({
        title: "日付を選択してください",
        variant: "destructive",
      });
      return;
    }

    if (!filledEntries.length) {
      toast({
        title: "少なくとも1つの感謝エントリーを入力してください",
        variant: "destructive",
      });
      return;
    }

    const invalidEntries = filledEntries.some(
      (entry) => !validateGratitudeEntry(entry)
    );

    if (invalidEntries) {
      toast({
        title: "すべてのエントリーを正しい形式で入力してください",
        description: "数字で始まり、「ありがとう」で終わる必要があります",
        variant: "destructive",
      });
      return;
    }

    // Format entries before submission
    const formattedEntries = filledEntries.map((entry, index) =>
      formatEntry(entry, index + 1)
    );

    // Here you would typically send the data to your backend
    console.log("Submitting entries for date:", selectedDate);
    console.log("Formatted entries:", formattedEntries);

    toast({
      title: "感謝の気持ちを記録しました",
      description: `${formattedEntries.length}件のエントリーを保存しました。`,
    });

    // Reset form
    setEntries([""]);
    setSelectedDate("");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">日付を選択</h2>
          <PauseDialog />
        </div>
        <DateSelector onDateSelect={setSelectedDate} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">感謝の気持ちを記録</h2>
          <Button
            onClick={addEntry}
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
              onChange={(value) => updateEntry(index, value)}
            />
          ))}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-gratitude-600 hover:bg-gratitude-700"
      >
        保存する
      </Button>
    </div>
  );
};