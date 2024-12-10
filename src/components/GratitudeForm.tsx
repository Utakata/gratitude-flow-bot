import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateSelector } from "./DateSelector";
import { GratitudeEntry } from "./GratitudeEntry";
import { validateGratitudeEntry, formatEntry } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { PauseDialog } from "./PauseDialog";

// Local Storage Keys
const STORAGE_KEYS = {
  USER_ID: 'gratitude-user-id',
  ENTRIES: 'gratitude-entries',
  SELECTED_DATE: 'gratitude-selected-date'
};

export const GratitudeForm = () => {
  const [userId, setUserId] = useState(() => 
    localStorage.getItem(STORAGE_KEYS.USER_ID) || ""
  );
  const [selectedDate, setSelectedDate] = useState(() => 
    localStorage.getItem(STORAGE_KEYS.SELECTED_DATE) || ""
  );
  const [entries, setEntries] = useState<string[]>(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return savedEntries ? JSON.parse(savedEntries) : [""];
  });
  const { toast } = useToast();

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, selectedDate);
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  }, [userId, selectedDate, entries]);

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
    if (!userId.trim()) {
      toast({
        title: "ユーザーIDを入力してください",
        variant: "destructive",
      });
      return;
    }

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
    console.log("Submitting entries for user:", userId);
    console.log("Submitting entries for date:", selectedDate);
    console.log("Formatted entries:", formattedEntries);

    toast({
      title: "感謝の気持ちを記録しました",
      description: `${formattedEntries.length}件のエントリーを保存しました。`,
    });

    // Reset form
    setEntries([""]);
    setSelectedDate("");
    // Don't reset userId as it should persist
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_DATE);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">ユーザー情報</h2>
        </div>
        <Input
          type="text"
          placeholder="ユーザーIDを入力してください"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="max-w-md"
        />
      </div>

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