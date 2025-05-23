import React from "react";
function InstructionsCard() {
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
          <li>
            I highly advice you to save your drop log using the Generate Save
            Code button, as i update the app frequently and drop log reset can
            happen.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default InstructionsCard;
