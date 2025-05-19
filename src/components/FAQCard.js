import React from "react";
function FAQCard() {
  return (
        <div className="hidden lg:block w-64 min-h-[300px]">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-2 border-b pb-1">FAQ</h2>
              <span className="text-gray-400 italic mt-8">
                *Q: Why should i put the sale price there, couldn't you fetch the prices from G.E.?<br></br><br></br>
                *A: Yes and no, the problem is, that the prices in G.E. (mid price) are usually different to what the item actually sells for.
              </span>
              </div>
        </div>
       );
}

export default FAQCard;