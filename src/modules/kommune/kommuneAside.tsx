import React from "react";
import { useFeatures, Stedsnavn } from "../features/useFeatures";

//type KommuneVectorLayer = VectorLayer<VectorSource<KommuneFeature>>;

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

export function KommuneAside({ isVisible }: { isVisible: boolean }) {
  const { visibleFeatures } = useFeatures(isVisible, "kommuner");

  return (
    <aside
      className={isVisible && visibleFeatures?.length ? "visible" : "hidden"}
    >
      <div>
        <h2>Kommuner</h2>
        <ul>
          {visibleFeatures?.map((k, index) => (
            <li key={index}>{getStedsnavn(k.getProperties().navn)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
