import { Line } from 'react-chartjs-2';
import CircularProgress from "@mui/material/CircularProgress";
import {useEffect, useState} from "react";
import api from "../../services/api";

export default function StockGraph({prices, loading, priceType, isDay, stock}) {

    const [p, setPrices] = useState(prices);

    useEffect(() => {
        // Sync local state with prop changes
        setPrices(prices);
    }, [prices]);

    useEffect(() => {
        if (!isDay) return;

        const fetchData = async () => {
            try {
                const response = await api.get(`/api/stocks/${stock.id}/prices/`);
                const data = response.data;

                // Get today's date in 'YYYY-MM-DD' format
                const today = new Date().toISOString().split('T')[0]; // Extract only the date part

                // Filter to get only today's entries
                const todaysData = data.filter(item => item.date === today);

                setPrices(todaysData);

            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        };

        fetchData();
    }, [isDay]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </div>
        );
    }

    if (!Array.isArray(p) || p.length === 0 ) {
        return <div>Error loading graph data.</div>;
    }

    const verticalLinePlugin = {
        id: 'verticalLine',
        afterEvent: (chart, args) => {
            const { ctx, chartArea, scales } = chart;
            const event = args.event;

            // Make sure the event is a mouse event and inside the chart area
            if (event.type === 'mousemove' && event.x >= chartArea.left && event.x <= chartArea.right) {
                // Store the mouse x position for drawing later
                chart.config._verticalLinePosition = event.x;
                chart.draw();
            }
        },
        afterDraw: (chart) => {
            const { ctx, chartArea } = chart;

            if (chart.config._verticalLinePosition) {
                const x = chart.config._verticalLinePosition;

                // Draw the vertical line
                ctx.save();
                ctx.beginPath();
                ctx.setLineDash([5, 5]); // Dotted line style
                ctx.moveTo(x, chartArea.top);
                ctx.lineTo(x, chartArea.bottom);
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Line color
                ctx.stroke();
                ctx.restore();
            }
        },
    };

    const stockData = {
        labels: p.map(price => new Date(isDay ? price.createdAt : price.date)),
        datasets: [{
            label: 'Stock Price',
            data: p.map(price => {
                switch (priceType) {
                    case 'Open':
                        return price.open;
                    case 'Closed':
                        return price.close;
                    case 'High':
                        return price.high;
                    case 'Low':
                        return price.low;
                    default:
                        return null; // Handle invalid state
                }
            }),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1, // Smooth lines
            pointRadius: 0, // Remove points for cleaner look
        }],
    };

    const calculateRange = (prices, type) => {
        const values = prices.map(price => {
            switch (type) {
                case 'Open':
                    return price.open;
                case 'Closed':
                    return price.close;
                case 'High':
                    return price.high;
                case 'Low':
                    return price.low;
                default:
                    return null;
            }
        });

        // Remove nulls (in case of invalid type)
        const validValues = values.filter(value => value !== null);

        // Calculate min and max with some padding
        return {
            max: Math.max(...validValues) + 50,
            min: Math.min(...validValues) - 50,
        };
    };

    const { max, min } = calculateRange(p, priceType);

    const stockOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: isDay ? 'hour' : 'day',
                    tooltipFormat: isDay ? 'HH:mm' : 'MMM d',
                    displayFormats: {
                        hour: 'h:mm a',
                        day: 'MMM d',
                    },
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: isDay ? 12 : 7,
                    callback: function(value) {
                        const date = new Date(value);
                        return isDay
                            ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    },
                },
                grid: {
                    display: false,
                },
                max: new Date(Math.max(...p.map(price => Date.parse(isDay ? price.createdAt : price.date)))),
                min: new Date(Math.min(...p.map(price => Date.parse(isDay ? price.createdAt : price.date)))),
            },
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.2)',
                },
                max: max,
                min: min,
            },
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
            },
            legend: {
                display: false,
            },
            verticalLine: verticalLinePlugin,
        },
        hover: {
            mode: 'index',
            intersect: false,
        },
        elements: {
            point: {
                radius: 1,
                hoverRadius: 5,
                hitRadius: 1,
            },
        },
        animation: {
            duration: 0,
        },
    };



    return (
        <div>
            <Line data={stockData} options={stockOptions} plugins={[verticalLinePlugin]}/>
        </div>
    );
}