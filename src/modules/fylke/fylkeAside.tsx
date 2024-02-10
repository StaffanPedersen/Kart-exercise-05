import React from "react";
import { useFeatures, Stedsnavn } from "../features/useFeatures";

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

export function FylkeAside({ isVisible }: { isVisible: boolean }) {
  const { visibleFeatures } = useFeatures(isVisible, "fylker");

  return (
    <aside
      className={isVisible && visibleFeatures?.length ? "visible" : "hidden"}
    >
      <div>
        <h2>Fylker</h2>
        <ul>
          {visibleFeatures?.map((k) => (
            <li key={k.getProperties().fylkesnummer}>
              {getStedsnavn(k.getProperties().navn)}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
