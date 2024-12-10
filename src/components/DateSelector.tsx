import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface DateSelectorProps {
  onDateSelect: (date: string) => void;
}

export const DateSelector = ({ onDateSelect }: DateSelectorProps) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  
  const [customDate, setCustomDate] = useState(today);
  const [selectedButton, setSelectedButton] = useState<"today" | "yesterday" | "custom">("today");

  useEffect(() => {
    // 初期値として今日の日付を設定
    onDateSelect(today);
  }, []);

  const handleDateSelect = (date: string, button: "today" | "yesterday" | "custom") => {
    setCustomDate(date);
    setSelectedButton(button);
    onDateSelect(date);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedButton === "today" ? "default" : "outline"}
          onClick={() => handleDateSelect(today, "today")}
          className="flex-1"
        >
          今日
        </Button>
        <Button
          variant={selectedButton === "yesterday" ? "default" : "outline"}
          onClick={() => handleDateSelect(yesterday, "yesterday")}
          className="flex-1"
        >
          昨日
        </Button>
      </div>
      <div className="flex gap-2">
        <Input
          type="date"
          value={customDate}
          onChange={(e) => {
            setCustomDate(e.target.value);
            setSelectedButton("custom");
          }}
          className="flex-1"
        />
        <Button
          variant={selectedButton === "custom" ? "default" : "outline"}
          onClick={() => handleDateSelect(customDate, "custom")}
          disabled={!customDate}
          className="bg-gratitude-600 hover:bg-gratitude-700"
        >
          選択
        </Button>
      </div>
    </div>
  );
};