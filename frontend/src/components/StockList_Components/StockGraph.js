import { Line } from 'react-chartjs-2';

export default function StockGraph({prices}) {

    if (!Array.isArray(prices)) {
        return <div>Error loading graph data.</div>;
    }

    const stockData = {
        labels: prices.map(price => new Date(price.date)),
        datasets: [{
            label: 'Stock Price',
            data: prices.map(price => price.open),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1, // Smooth lines
            pointRadius: 0, // Remove points for cleaner look
        }],
    };

    const stockOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'MMM d, yyyy',
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 12,
                },
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.2)',
                },
                max: Math.max(...prices.map(price => price.open)) + 50,
                min: Math.min(...prices.map(price => price.open)) - 50,
            },
        },
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
            },
            legend: {
                display: false,
            },
        },

        elements: {
            point: {
                radius: 1,
                hoverRadius: 3,
                hitRadius: 10,
            },
        },
    };

    return (
        <div>
            <Line data={stockData} options={stockOptions} />
        </div>
    );
}