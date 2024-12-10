import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface DateSelectorProps {
  onDateSelect: (date: string) => void;
}

export const DateSelector = ({ onDateSelect }: DateSelectorProps) => {
  const [customDate, setCustomDate] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => onDateSelect(today)}
          className="flex-1"
        >
          今日
        </Button>
        <Button
          variant="outline"
          onClick={() => onDateSelect(yesterday)}
          className="flex-1"
        >
          昨日
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          type="date"
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={() => customDate && onDateSelect(customDate)}
          disabled={!customDate}
          className="bg-gratitude-600 hover:bg-gratitude-700"
        >
          選択
        </Button>
      </div>
    </div>
  );
};