"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function QuantitySelector({ stock, onChange }) {
  const [qty, setQty] = useState(1);

  const update = (val) => {
    const next = Math.max(1, Math.min(val, stock));
    setQty(next);
    onChange?.(next);
  };

  return (
    <div className="flex items-center border border-outline-variant rounded-DEFAULT h-12 w-full sm:w-32 bg-surface-container-lowest">
      <button
        onClick={() => update(qty + 1)}
        className="w-10 h-full flex items-center justify-center text-on-surface hover:text-secondary transition-colors cursor-pointer"
      >
        <Plus size={16} />
      </button>
      <input
        type="number"
        value={qty}
        min={1}
        max={stock}
        onChange={(e) => update(Number(e.target.value))}
        className="w-full text-center border-none bg-transparent font-headline-sm text-primary focus:ring-0 p-0 m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        onClick={() => update(qty - 1)}
        disabled={qty <= 1}
        className="w-10 h-full flex items-center justify-center text-on-surface hover:text-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        <Minus size={16} />
      </button>
    </div>
  );
}
