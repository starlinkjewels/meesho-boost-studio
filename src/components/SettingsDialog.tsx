import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { toast } from "sonner";

const KEY_STORAGE = "kie_api_key";

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(KEY_STORAGE) || "";
}

export function SettingsDialog({ onChange }: { onChange?: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");

  useEffect(() => {
    setKey(getStoredApiKey());
  }, [open]);

  const save = () => {
    localStorage.setItem(KEY_STORAGE, key.trim());
    onChange?.(key.trim());
    toast.success("API key saved locally");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="size-4 mr-2" /> Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key</DialogTitle>
          <DialogDescription>
            Your personal API key. Stored only in your browser (localStorage) and never sent anywhere except directly from your device to generate images.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>
        <DialogFooter>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
