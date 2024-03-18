import * as d3 from "d3";
import { Data } from "./types";

export const getXScale = (width: number) => {
  return d3.scaleTime().range([0, width]);
};

export const getYScale = (height: number) => {
  return d3.scaleLinear().range([height, 0]);
};

export const getPriceLine = (
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) => {
  return d3
    .line<Data>()
    .x((d) => x(new Date(d.date)))
    .y((d) => y(d.price));
};

export const getDataNest = (data: Data[]) => {
  return Array.from(
    d3.group(data, (d) => d.symbol),
    ([key, value]) => ({ key, value })
  );
};

export const getColorScale = () => {
  return d3.scaleOrdinal(d3.schemeCategory10);
};

export const toggleLine = (key: string) => {
  const line = d3.select(`.line-${key}`);
  const legend = d3.select(`.legend-${key}`);

  const lineOpacity = line.style("opacity");
  const legendOpacity = legend.style("opacity");

  line.style("opacity", lineOpacity === "1" ? "0.3" : "1");
  legend.style("opacity", legendOpacity === "1" ? "0.3" : "1");
};
