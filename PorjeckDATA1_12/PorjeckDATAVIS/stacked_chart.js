document.addEventListener("DOMContentLoaded", () => {
    // Chart dimensions and margins
    const margin = { top: 20, right: 200, bottom: 50, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Tooltip for hover effects
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Load and process data
    d3.csv("Manufacturing_Sorted.csv").then(data => {
        // Check if data is loaded
        console.log("Data Loaded:", data);

        // Filter out unwanted years (2013, 2015, 2017, 2019, 2020) and any data with OBS_VALUE = 0
        const filteredData = data.filter(d => 
            !["2013", "2015", "2017", "2019", "2020"].includes(d.TIME_PERIOD) && +d.OBS_VALUE > 0
        );

        // Check filtered data
        console.log("Filtered Data:", filteredData);

        // Extract unique years and countries dynamically
        const years = [...new Set(filteredData.map(d => d.TIME_PERIOD))];
        const countries = [...new Set(filteredData.map(d => d["Reference area"]))];

        // Convert OBS_VALUE to numbers
        filteredData.forEach(d => {
            d.OBS_VALUE = +d.OBS_VALUE || 0;  // Convert to number, set 0 if null or NaN
        });

        // Prepare grouped data for stacking
        const groupedData = years.map(year => {
            const yearData = { TIME_PERIOD: year, cumulated: {} }; // Add a "cumulated" property
            let cumulativeSum = 0;

            countries.forEach(country => {
                const entry = filteredData.find(d => d.TIME_PERIOD === year && d["Reference area"] === country);
                const value = entry ? entry.OBS_VALUE : 0;

                cumulativeSum += value; // Calculate cumulative total for each country
                yearData[country] = value;
                yearData.cumulated[country] = cumulativeSum; // Store cumulative sum per country
            });

            return yearData;
        });

        // Stack data
        const stack = d3.stack().keys(countries);
        const stackedData = stack(groupedData);

        // Scales
        const xScale = d3.scaleBand()
            .domain(groupedData.map(d => d.TIME_PERIOD))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1])])
            .nice()
            .range([height, 0]);

        // Balanced color palette
        const balancedColors = [
            "#ff9999", // Soft Red
            "#ffa500", // Medium Orange
            "#ffd700", // Golden Yellow
            "#90ee90", // Soft Green
            "#87ceeb", // Sky Blue
            "#9370db", // Medium Purple
            "#ffb6c1", // Light Pink
        ];

        const colorScale = d3.scaleOrdinal()
            .domain(countries)
            .range(balancedColors);

        // X-axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        // Y-axis
        svg.append("g")
            .call(d3.axisLeft(yScale).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("dy", "1em")
            .attr("text-anchor", "end")
            .text("Waste Generated (Tonnes)");

        // Add bars with tooltip
        svg.selectAll(".layer")
        .data(stackedData)
        .join("g")
        .attr("fill", d => colorScale(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => xScale(d.data.TIME_PERIOD))
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .on("mouseover", (event, d) => { 
            const country = d3.select(event.target.parentNode).datum().key; // Get the country name
            const currentValue = (d[1] - d[0]).toFixed(2); // Current value of the bar
            const cumulatedValue = d.data.cumulated[country].toFixed(2); // Cumulative value for the country

            tooltip.transition().duration(200).style("opacity", 1); // Show tooltip
            tooltip.html(`
                <strong>Country:</strong> ${country}<br>
                <strong>Year:</strong> ${d.data.TIME_PERIOD}<br>
                <strong>Value:</strong> ${currentValue} tonnes<br>
                <strong>Cumulated:</strong> ${cumulatedValue} tonnes
            `)
            .style("left", (event.pageX + 5) + "px") // Tooltip position
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0)); // Add this too

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 20}, 0)`);

        countries.forEach((country, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 25})`);

            legendRow.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", colorScale(country));

            legendRow.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .text(country)
                .style("font-size", "12px")
                .style("font-family", "Arial, sans-serif");
        });
    }).catch(error => console.error("Error loading data:", error));
    
    // Smooth scroll to next section when clicking the scroll down arrow
    document.querySelector('.arrow-down').addEventListener('click', function() {
        document.querySelector('#section2').scrollIntoView({
            behavior: 'smooth'
        });
    });
});
