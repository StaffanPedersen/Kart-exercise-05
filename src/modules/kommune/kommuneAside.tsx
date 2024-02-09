import React, { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";

type KommuneVectorLayer = VectorLayer<VectorSource<KommuneFeature>>;

interface KommuneProperties {
  kommunenummer: string;
  navn: Stedsnavn[];
}

interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

type KommuneFeature = {
  getProperties(): KommuneProperties;
} & Feature;

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

function useKommuneFeatures(isVisible: boolean) {
  const { map, layers } = useContext(MapContext);
  const layer = layers.find(
      (l) => l.getClassName() === "kommuner",
  ) as KommuneVectorLayer;
  const [features, setFeatures] = useState<KommuneFeature[]>();
  const [visibleFeatures, setVisibleFeatures] = useState<KommuneFeature[]>();
  const [viewExtent, setViewExtent] = useState(
      map.getView().getViewStateAndExtent().extent,
  );

  function handleSourceChange() {
    const newFeatures = layer?.getSource()?.getFeatures();
    setFeatures(newFeatures);
    const newVisibleFeatures = newFeatures?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent));
    setVisibleFeatures(newVisibleFeatures);
  }
  useEffect(() => {
    const newVisibleFeatures = features?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent));
    setVisibleFeatures(newVisibleFeatures);
  }, [viewExtent, features]);

  function handleViewChange() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }

  useEffect(() => {
    layer?.getSource()?.on("change", handleSourceChange);
    return () => layer?.getSource()?.un("change", handleSourceChange);
  }, [layer]);

  useEffect(() => {
    map.getView().on("change", handleViewChange);
    return () => map.getView().un("change", handleViewChange);
  }, [map]);

  useEffect(() => {
    if (layer) {
      layer.setVisible(isVisible);
    }
    if (isVisible) {
      handleSourceChange();
    }
  }, [isVisible, layer]);

  return { kommuneLayer: layer, features, visibleFeatures };
}

export function KommuneAside({ isVisible }: { isVisible: boolean }) {
  const { visibleFeatures } = useKommuneFeatures(isVisible);

  return (
      <aside className={isVisible && visibleFeatures?.length ? "visible" : "hidden"}>
        <div>
          <h2>Kommuner</h2>
          <ul>
            {visibleFeatures?.map((k) => (
                <li key={k.getProperties().kommunenummer}>
                  {getStedsnavn(k.getProperties().navn)}
                </li>
            ))}
          </ul>
        </div>
      </aside>
  );
}
