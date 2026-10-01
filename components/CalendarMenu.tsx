"use client";

import { useState } from "react";

export default function CalendarMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        📅 تقویم
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "48px",
            right: 0,
            minWidth: "170px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            zIndex: 1000,
          }}
        >
          <button
            style={itemStyle}
            onClick={() => alert("تقویم قمری")}
          >
            🌙 تقویم قمری
          </button>

          <button
            style={itemStyle}
            onClick={() => alert("تقویم شمسی")}
          >
            ☀️ تقویم شمسی
          </button>

          <button
            style={itemStyle}
            onClick={() => alert("تقویم میلادی")}
          >
            📅 تقویم میلادی
          </button>
        </div>
      )}
    </div>
  );
}

const itemStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  margin: "2px 0",
  border: "none",
  borderRadius: "8px",
  background: "transparent",
  textAlign: "right" as const,
  cursor: "pointer",
  fontSize: "15px",
};
