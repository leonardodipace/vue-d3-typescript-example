<script setup lang="ts">
import * as d3 from "d3";
import { onMounted } from "vue";
import { Data } from "../utils/types";
import {
  getColorScale,
  getDataNest,
  getPriceLine,
  getXScale,
  getYScale,
  toggleLine,
} from "../utils/misc";

const WIDTH = 800;
const HEIGHT = 500;
const TRANSITION_DURATION = 1500;

const generateChart = () => {
  const margins = { top: 30, right: 20, bottom: 70, left: 50 };
  const width = WIDTH - margins.left - margins.right;
  const height = HEIGHT - margins.top - margins.bottom;

  const x = getXScale(width);
  const y = getYScale(height);

  const priceLine = getPriceLine(x, y);

  // Select the svg element and make room for axis and labels
  const svg = d3
    .select("svg")
    .attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.top + margins.bottom)
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);

  // Load data
  d3.json<Data[]>("data.json").then((data) => {
    if (!data) return;

    // Set x and y domains
    x.domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date]);
    y.domain([0, d3.max(data, (d) => d.price) as number]);

    // Create a d3 group
    const dataNest = getDataNest(data);

    // Get the color scale
    const color = getColorScale();

    const legendSpace = width / dataNest.length;

    dataNest.forEach((d, i) => {
      // For each item in the d3 group, create a line
      const path = svg
        .append("path")
        .attr("fill", "none")
        .style("stroke", () => color(d.key))
        .attr("class", `line-${d.key}`)
        .attr("d", priceLine(d.value));

      const totalLength = path.node()?.getTotalLength();

      // Apply some basic style and animation to the line
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength!)
        .transition()
        .duration(TRANSITION_DURATION)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Add an interactive legend
      svg
        .append("text")
        .attr("x", legendSpace / 2 + i * legendSpace)
        .attr("y", height + margins.bottom / 2 + 5)
        .attr("class", `legend-${d.key}`)
        .style("fill", () => color(d.key))
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("cursor", "pointer")
        .text(d.key)
        .on("click", () => toggleLine(d.key));
    });

    // Add the x axis to the chart and place it at the bottom
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add the y axis to the chart
    svg.append("g").call(d3.axisLeft(y));
  });
};

onMounted(() => {
  generateChart();
});
</script>

<template>
  <svg></svg>
  <p>
    You can click on any stock name below the graph to toggle its visibility on
    the chart.
  </p>
</template>

<style scoped>
p {
  font-size: 14px;
  color: darkslategrey;
}
</style>
