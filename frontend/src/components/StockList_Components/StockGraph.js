import { Line } from 'react-chartjs-2';
import CircularProgress from "@mui/material/CircularProgress";
import {useEffect, useState} from "react";

export default function StockGraph({prices, loading, priceType}) {

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </div>
        );
    }

    if (!Array.isArray(prices) || prices.length === 0 ) {
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
        labels: prices.map(price => new Date(price.date)),
        datasets: [{
            label: 'Stock Price',
            data: prices.map(price => {
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
                max: new Date(Math.max(...prices.map(price => Date.parse(price.date)))),
                min: new Date(Math.min(...prices.map(price => Date.parse(price.date)))),
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
        }
    };

    return (
        <div>
            <Line data={stockData} options={stockOptions} plugins={[verticalLinePlugin]}/>
        </div>
    );
}