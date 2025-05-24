"use client";

import React, { useEffect, useRef } from "react";
import { candidateColorMap, type VoteRegion } from "@/lib/vars";
import type { RegionRankData } from "@/lib/actions";
import { useAtom } from "jotai";
import { clickRegionAtom } from "./atoms";
import KoreaMap from "./KoreaMap";

export default function GeoMap({ data }: { data: RegionRankData }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [clickRegion, setClickRegion] = useAtom(clickRegionAtom);

  useEffect(() => {
    if (!svgRef.current) return;

    for (const [region, ranks] of Object.entries(data)) {
      const top = ranks[0];
      const isNotHighest = ranks.slice(1).some(r => r.count === top.count);
      const color = top.count > 0 && !isNotHighest ? candidateColorMap[top.candidate] : "#E5E7EB";
      const pathRef = svgRef.current.querySelector(`path[id="${region}"]`);
      const clicked = clickRegion === region;

      if (pathRef) {
        const path = pathRef as SVGPathElement;
        path.style.fill = clicked ? "black" : color;
        path.style.transition = "ease 300ms";
      }
    }
  }, [data, clickRegion]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement, Event>) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() !== "path") return;

    if (!target.id) return;
    const region = target.id as VoteRegion;

    if (data[region] && data[region][0].count > 0) {
      setClickRegion(prev => region !== prev ? region : null);
    }
  };

  const handleHover = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() !== "path") return;

    if (!target.id) return;
    const region = target.id as VoteRegion;

    if (data[region] && data[region][0].count > 0) {
      target.style.cursor = "pointer";
      target.style.stroke = "#000";
      target.style.strokeWidth = "1";
      target.style.strokeOpacity = "0.8";
    }
  };

  const handleLeave = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() !== "path") return;
    target.style.cursor = "";
    target.style.stroke = "";
    target.style.strokeWidth = "";
    target.style.strokeOpacity = "";
  };

  return (
    <div className="w-full">
      <KoreaMap
        className="w-full h-auto max-h-[80vh]"
        onClick={handleClick}
        onMouseOver={handleHover}
        onMouseOut={handleLeave}
        style={{ width: "100%", height: "auto" }}
        ref={svgRef}
      />
    </div>
  );
}
