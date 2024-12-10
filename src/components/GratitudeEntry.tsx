import { validateGratitudeEntry } from "@/lib/validation";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface GratitudeEntryProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
}

export const GratitudeEntry = ({ index, value, onChange }: GratitudeEntryProps) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value) {
      setIsValid(validateGratitudeEntry(value));
    } else {
      setIsValid(true);
    }
  }, [value]);

  return (
    <div className="space-y-2 animate-fadeIn">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`${index}. 感謝の内容を入力してください。\n例: ${index}. 家族に感謝します。今日も美味しい食事を作ってくれて、ありがとう！`}
        className={`min-h-[100px] ${
          !isValid && value ? "border-red-500" : ""
        }`}
      />
      {!isValid && value && (
        <p className="text-sm text-red-500">
          エントリーは数字で始まり、「ありがとう」で終わる必要があります。
        </p>
      )}
    </div>
  );
};