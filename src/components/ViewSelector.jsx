import React from "react";
import { useAtom } from "jotai";
import { currentViewAtom } from "@/lib/atoms";

const views = [
  { value: "default", label: "Default" },
  { value: "transparent", label: "Transparent" },
  { value: "lineweight", label: "Lineweight" },
  { value: "arctic", label: "Arctic" },
];

export function ViewSelector() {
  const [currentView, setCurrentView] = useAtom(currentViewAtom);

  return (
    <div style={{ background: "white", padding: "10px", borderRadius: "5px" }}>
      <label htmlFor="view-select">View: </label>
      <select id="view-select" onChange={(e) => setCurrentView(e.target.value)} value={currentView}>
        {views.map((view) => (
          <option key={view.value} value={view.value}>
            {view.label}
          </option>
        ))}
      </select>
    </div>
  );
}