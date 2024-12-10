import { Button } from "@/components/ui/button";
import { validateGratitudeEntry, formatEntry } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserInfoSection } from "./sections/UserInfoSection";
import { DateSection } from "./sections/DateSection";
import { EntriesSection } from "./sections/EntriesSection";

// Local Storage Keys
const STORAGE_KEYS = {
  USER_ID: 'gratitude-user-id',
  ENTRIES: 'gratitude-entries',
  SELECTED_DATE: 'gratitude-selected-date'
};

export const GratitudeForm = () => {
  const [userId, setUserId] = useLocalStorage(STORAGE_KEYS.USER_ID, "");
  const [selectedDate, setSelectedDate] = useLocalStorage(STORAGE_KEYS.SELECTED_DATE, "");
  const [entries, setEntries] = useLocalStorage<string[]>(STORAGE_KEYS.ENTRIES, [""]);
  const { toast } = useToast();

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    if (entries.length < 20) {
      setEntries([...entries, ""]);
    }
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

    const formattedEntries = filledEntries.map((entry, index) =>
      formatEntry(entry, index + 1)
    );

    console.log("Submitting entries for user:", userId);
    console.log("Submitting entries for date:", selectedDate);
    console.log("Formatted entries:", formattedEntries);

    toast({
      title: "感謝の気持ちを記録しました",
      description: `${formattedEntries.length}件のエントリーを保存しました。`,
    });

    setEntries([""]);
    setSelectedDate("");
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_DATE);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <UserInfoSection userId={userId} onUserIdChange={setUserId} />
      <DateSection onDateSelect={setSelectedDate} />
      <EntriesSection
        entries={entries}
        onEntryChange={handleEntryChange}
        onAddEntry={addEntry}
      />
      <Button
        onClick={handleSubmit}
        className="w-full bg-gratitude-600 hover:bg-gratitude-700"
      >
        保存する
      </Button>
    </div>
  );
};