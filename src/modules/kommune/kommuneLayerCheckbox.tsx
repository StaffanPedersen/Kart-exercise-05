// src/modules/kommune/kommuneLayerCheckbox.tsx
import React from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { useLayer } from "../map/useLayer";

const kommuneLayer = new VectorLayer({
    className: "kommuner",
    source: new VectorSource({
        url: "./kommuner.json",
        format: new GeoJSON(),
    }),
});

interface KommuneLayerCheckboxProps {
    checked: boolean;
    setChecked: (checked: boolean) => void;
}

export function KommuneLayerCheckbox({ checked, setChecked }: KommuneLayerCheckboxProps) {
    useLayer(kommuneLayer, checked);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? "Hide" : "Show"} kommuner
      </label>
    </div>
  );
}
