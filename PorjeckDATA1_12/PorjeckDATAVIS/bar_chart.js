window.onload = function() {
    const ctx = document.getElementById('BarChart').getContext('2d');
  
    const data = {
      labels: [
        'Austria 2012', 'Austria 2014', 'Austria 2016',
        'Belgium 2012', 'Belgium 2014', 'Belgium 2016', 
        'Denmark 2012', 'Denmark 2014', 'Denmark 2016', 
        'Korea 2012', 'Korea 2014', 'Korea 2016',
        'Spain 2012', 'Spain 2014', 'Spain 2016', 
        'United Kingdom 2012', 'United Kingdom 2014', 'United Kingdom 2016'
      ],
      datasets: [{
        label: 'Value',
        data: [
          349.041, 265.288, 305.10,
          1301.009, 1109.34, 780.448, 
          795.142, 977.297, 672.772, 
          7835.5133, 9849.7941, 10842.4846,
          5768.856, 5271.442, 3873.755, 
          4661.058, 2768.693, 1178.721
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  
    const config = {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  
    const myChart = new Chart(ctx, config);
  };
  