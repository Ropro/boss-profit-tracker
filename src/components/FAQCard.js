import React from "react";
function FAQCard() {
  return (
    <div className="hidden lg:block w-64 min-h-[300px]">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-2 border-b pb-1">FAQ</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            *Q - Why sould i add sale price manually? Couldn't you fetch it from
            G.E.?
          </li>
          <li>
            *A - Unfortunately, many items have a different mid price than what
            the item actually sells for, if you want precise statistics, input
            your sale prices manually.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FAQCard;
