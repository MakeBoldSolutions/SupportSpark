import { useState, useEffect, useMemo } from "react";
import { storage } from "@/lib/local-storage-adapter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function PreviewBanner() {
  const [storageWarning, setStorageWarning] = useState(false);
  const isAuthenticated = useMemo(() => storage.getCurrentUser() !== null, []);

  useEffect(() => {
    storage.getStorageUsagePercent().then((pct) => {
      if (pct >= 80) setStorageWarning(true);
    });
  }, []);

  const handleReset = () => {
    storage.resetAllData();
    window.location.hash = "#/";
    window.location.reload();
  };

  return (
    <div className="bg-amber-100 border-b border-amber-300 px-4 py-2 text-center text-sm text-amber-900">
      <span className="font-semibold">Preview Alpha</span>
      <span className="mx-2">—</span>
      <span>All data is stored locally in your browser.</span>
      {storageWarning && (
        <span className="ml-2 inline-flex items-center gap-1 text-amber-700">
          <AlertTriangle className="w-3 h-3" />
          Storage nearly full
        </span>
      )}
      {isAuthenticated && (
        <Button
          variant="link"
          size="sm"
          className="ml-2 text-amber-900 underline h-auto p-0"
          onClick={handleReset}
        >
          Reset Demo Data
        </Button>
      )}
    </div>
  );
}
