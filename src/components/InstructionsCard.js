import React, { useState } from "react";
import { Button } from "./ui/button";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function InstructionsCard({
  bossData,
  importError,
  onImport,
  setImportError,
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [localImportError, setLocalImportError] = useState("");

  const handleExportClick = () => {
    if (!bossData) {
      setExportCode("No data to export.");
      setExportOpen(true);
      setCopied(false);
      return;
    }
    try {
      const code = btoa(JSON.stringify(bossData));
      setExportCode(code);
      setExportOpen(true);
      setCopied(false);
    } catch (e) {
      setExportCode("Error exporting data.");
      setExportOpen(true);
      setCopied(false);
    }
  };

  const handleCopy = () => {
    if (exportCode) {
      navigator.clipboard.writeText(exportCode);
      setCopied(true);
    }
  };

  const handleImportSubmit = () => {
    try {
      const imported = JSON.parse(atob(importCode));
      onImport(imported);
      if (setImportError) setImportError("");
      setLocalImportError("");
      setImportOpen(false);
      setImportCode("");
    } catch (e) {
      setLocalImportError("Invalid save code!");
      if (setImportError) setImportError("Invalid save code!");
    }
  };

  return (
    <div className="hidden lg:block w-64 min-h-[300px]">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-2 border-b pb-1">
          Instructions
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Select a boss from the dropdown menu.</li>
          <li>Set your average kill time (minutes and seconds).</li>
          <li>
            Add drops to your log by selecting the drop, entering the kill
            number, sale price, and clicking "Add Drop".
          </li>
          <li>
            For bosses with common drops stored in chest, enter the chest value
            and set it. (optional)
          </li>
          <li>Review your GP statistics and drop log.</li>
          <li className="text-red-600 font-bold">
            I highly suggest to save your drop log code using the Export Data
            button from time to time, as I update the app frequently and drop
            log reset can happen. (Hopefully not)
          </li>
        </ul>

        {/* --- Export/Import Buttons --- */}
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={handleExportClick}>Export Data</Button>
          <Button
            variant="outline"
            onClick={() => {
              setImportOpen(true);
              setLocalImportError("");
              if (setImportError) setImportError("");
            }}
          >
            Import Data
          </Button>
        </div>
        {/* Export Modal */}
        <Modal
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          title="Export Data"
        >
          <textarea
            className="w-full p-2 bg-gray-100 text-xs mb-2"
            value={exportCode}
            readOnly
            rows={3}
          />
          <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
        </Modal>
        {/* Import Modal */}
        <Modal
          open={importOpen}
          onClose={() => setImportOpen(false)}
          title="Import Data"
        >
          <textarea
            className="w-full p-2 bg-gray-100 text-xs mb-2"
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            placeholder="Paste your save code here"
            rows={3}
          />
          <Button onClick={handleImportSubmit} className="mr-2">
            Import
          </Button>
          {(localImportError || importError) && (
            <div className="text-red-500 text-sm mt-2">
              {localImportError || importError}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
