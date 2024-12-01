var ctx = document.getElementById('AreaGraph').getContext('2d');

// Initial dataset (we will update this later based on slider)
var initialData = {
    labels: ['2012', '2014', '2016', '2018', ],
    datasets: [
        {
            label: 'Austria',
            data: [178.972, 124.144, 130.459, 136.105, 164.032],
            fill: true,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.4
        },
        {
            label: 'Belgium',
            data: [165.463, 298.589, 269.182, 362.508, 417.289],
            fill: true,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4
        },
        {
            label: 'Denmark',
            data: [73.01, 114.474, 200.162, 372.182, 387.266],
            fill: true,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4
        },
        {
            label: 'Korea',
            data: [278.6, 434.4, 434.4, 154.9, 650.03],
            fill: true,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.4
        },

        {
            label: 'United Kingdom',
            data: [610.133, 612.429, 576.195, 616.865, 634.132],
            fill: true,
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            tension: 0.4
        }
    ]
};

// Create the chart
var chart = new Chart(ctx, {
    type: 'line',
    data: initialData,
    options: {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
        }
    }
});

// Handle slider change event
document.getElementById("slider").addEventListener("input", function() {
    var selectedYear = this.value;
    document.getElementById("sliderValue").innerText = "Year: " + selectedYear;

    // Update chart data based on selected year
    var newData = updateDataForYear(selectedYear);
    chart.data.datasets.forEach((dataset, index) => {
        dataset.data = newData[index];
    });
    chart.update();
});

// Function to update data based on selected year
function updateDataForYear(year) {
    var yearIndex = ['2012', '2014', '2016', '2018', '2020'].indexOf(year);
    if (yearIndex === -1) return [];

    // Data for each country (with values per year)
    var dataForYear = {
        'Austria': [178.972, 124.144, 136.105, 164.032], // Austria data
        'Belgium': [165.463, 298.589, 269.182, 362.508, 417.289], // Belgium data
        'Denmark': [73.01, 114.474, 200.162, 372.182, 387.266], // Denmark data
        'Korea': [278.6, 431.6, 434.4, 243.7, 650.0315], // Korea data
        'Spain': [5494.798, 5811.535, 6267.066, 6253.888, 6326.217], // Spain data
        'United Kingdom': [610.133, 612.429, 576.195, 616.865] // UK data
    };

    // Create new datasets for each country based on selected year
    return Object.keys(dataForYear).map(country => {
        var countryData = dataForYear[country][yearIndex] || 0; // Get data for the selected year
        return countryData; // Return the data for that country
    });
}

// Button functionality to show/hide datasets (countries)
document.getElementById("AustriaBtn").addEventListener("click", toggleDataset.bind(null, 0, 'Austria'));
document.getElementById("BelgiumBtn").addEventListener("click", toggleDataset.bind(null, 1, 'Belgium'));
document.getElementById("DenmarkBtn").addEventListener("click", toggleDataset.bind(null, 2, 'Denmark'));
document.getElementById("KoreaBtn").addEventListener("click", toggleDataset.bind(null, 3, 'Korea'));
document.getElementById("SpainBtn").addEventListener("click", toggleDataset.bind(null, 4, 'Spain'));
document.getElementById("UKBtn").addEventListener("click", toggleDataset.bind(null, 5, 'United Kingdom'));

// Toggle dataset visibility
function toggleDataset(index, country) {
    const dataset = chart.data.datasets[index];
    const isVisible = dataset.hidden === undefined ? false : dataset.hidden;

    dataset.hidden = !isVisible;
    chart.update();
}