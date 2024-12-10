import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const PAUSE_REASONS = [
  { value: "health", label: "体調不良" },
  { value: "family", label: "家族との時間" },
  { value: "personal", label: "個人的な事情" },
  { value: "travel", label: "旅行/出張" },
  { value: "event", label: "特別なイベント" },
  { value: "other", label: "その他" },
];

export const PauseDialog = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) {
      toast({
        title: "必須項目を入力してください",
        variant: "destructive",
      });
      return;
    }

    // ここで休止期間の登録処理を実装
    console.log("休止期間登録:", {
      startDate,
      endDate,
      reason,
      description,
    });

    toast({
      title: "休止期間を登録しました",
      description: `${startDate}から${endDate}まで休止します`,
    });

    // フォームをリセット
    setStartDate("");
    setEndDate("");
    setReason("");
    setDescription("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          お休み登録
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>感謝ワークのお休み登録</DialogTitle>
          <DialogDescription>
            休止期間と理由を入力してください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">開始日</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">終了日</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">理由</label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="理由を選択してください" />
              </SelectTrigger>
              <SelectContent>
                {PAUSE_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">補足</label>
            <Input
              placeholder="補足説明（任意）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>登録する</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};