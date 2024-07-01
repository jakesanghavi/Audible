import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const StatsPlot = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        // Count occurrences of each value, including nulls (failures)
        const counts = {};
        data.forEach(d => {
            if (d === null) {
                counts['Failed'] = (counts['Failed'] || 0) + 1; // Count null values as 'Failed'
            }
            else {
                counts[d] = (counts[d] || 0) + 1;
            }
        });

        // Explicitly set the domain to include all values from 1 to 5 and null
        const domain = ['1', '2', '3', '4', '5', 'Failed'];

        // Width and height of the SVG
        const width = 400;
        const height = 300;
        const margin = { top: 20, right: 20, bottom: 50, left: 50 };

        // Create SVG element
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Define scales
        const xScale = d3.scaleBand()
            .domain(domain)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(counts))])
            .range([height, 0]);

        // Draw bars
        svg.selectAll(".bar")
            .data(domain)
            .enter().append("rect")
            .attr("class", (d, i) => i === domain.length - 1 ? "bar latest" : "bar") // Assign a class to the most recent bar
            .attr("x", d => xScale(d))
            .attr("width", xScale.bandwidth())
            .attr("y", d => yScale(counts[d] || 0)) // Use 0 if count is undefined
            .attr("height", d => height - yScale(counts[d] || 0)) // Use 0 if count is undefined
            .attr("fill", (d, i) => i === domain.length - 1 ? "green" : "black"); // Apply red fill to the most recent bar

        // Add text labels above the bars
        svg.selectAll(".bar-label")
            .data(domain)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(counts[d] || 0)) // Position text above the bar
            .attr("dy", "-0.25em")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .text(d => counts[d] || 0);

        // Draw x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickValues(domain));

        // Draw y-axis with custom tick values
        // svg.append("g")
        //     .call(d3.axisLeft(yScale)
        //         .tickValues(Object.values(counts))
        //         .tickFormat(d3.format("d"))); // Format ticks as integers;

        // Add labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.top + 20)
            .style("text-anchor", "middle")
            .text("# Guesses");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Count");
    }, [data]);

    return (
        <svg ref={svgRef}></svg>
    );
};

export default StatsPlot;
