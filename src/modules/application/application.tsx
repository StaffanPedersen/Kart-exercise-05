// src/modules/application/application.tsx
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";
import { SchoolLayerCheckbox } from "../school/schoolLayerCheckbox";
import { SchoolAside } from "../school/schoolAside";

export function Application() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({ source: new OSM() }),
  ]);
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  // Add state for FylkeLayerCheckbox and KommuneLayerCheckbox
  const [fylkeChecked, setFylkeChecked] = useState(false);
  const [kommuneChecked, setKommuneChecked] = useState(false);

  return (
      <MapContext.Provider value={{ map, layers, setLayers }}>
        <header>
          <h1>Kommune kart</h1>
        </header>
        <nav>
          <a href={"#"} onClick={handleFocusUser}>
            Focus on me
          </a>
          {/* Pass down the state and the setter as props */}
          <KommuneLayerCheckbox checked={kommuneChecked} setChecked={() => setKommuneChecked(!kommuneChecked)} />
          <FylkeLayerCheckbox checked={fylkeChecked} setChecked={() => setFylkeChecked(!fylkeChecked)} />
          <SchoolLayerCheckbox />
        </nav>
        <main>
          <div ref={mapRef}></div>
          <SchoolAside/>
          {/* Conditionally render FylkeAside and KommuneAside here */}
          {fylkeChecked && <FylkeAside isVisible={fylkeChecked} />}
          {kommuneChecked && <KommuneAside isVisible={kommuneChecked} />}
        </main>
      </MapContext.Provider>
  );
}
