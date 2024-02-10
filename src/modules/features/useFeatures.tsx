import { useContext, useEffect, useState } from "react";
import { MapContext } from "../map/mapContext";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";

interface Stedsnavn {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
}

interface FylkeProperties {
  fylkesnummer: string;
  navn: Stedsnavn[];
}
export type FylkeFeature = {
  getProperties(): FylkeProperties;
} & Feature;

interface KommuneProperties {
  kommunenummer: string;
  navn: Stedsnavn[];
}

type KommuneFeature = {
  getProperties(): KommuneProperties;
} & Feature;

export function useFeatures(isVisible: boolean, layerName: string) {
  const { map, layers } = useContext(MapContext);
  const layer = layers.find(
    (l) => l.getClassName() === layerName,
  ) as VectorLayer<VectorSource<Feature>>;
  const [features, setFeatures] = useState<Feature[]>();
  const [visibleFeatures, setVisibleFeatures] = useState<KommuneFeature[]>();
  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );

  function handleSourceChange() {
    const newFeatures = layer?.getSource()?.getFeatures();
    setFeatures(newFeatures);
    const visibleFeatures = newFeatures?.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    ) as KommuneFeature[];
    setVisibleFeatures(visibleFeatures);
  }

  useEffect(() => {
    const visibleFeatures = features?.filter((f) =>
      f.getGeometry()?.intersectsExtent(viewExtent),
    ) as KommuneFeature[];
    setVisibleFeatures(visibleFeatures);
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

  return { layer, features, visibleFeatures };
}

export { Stedsnavn, KommuneProperties };
