"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StoreOverviewChartProps {
  productCount: number;
  activeOrders: number;
  inventoryStatus: number; // percent
  customerSatisfaction: number; // 0-5
}

export default function StoreOverviewChart({
  productCount,
  activeOrders,
  inventoryStatus,
  customerSatisfaction,
}: StoreOverviewChartProps) {
  const data = {
    labels: [
      "Total Products",
      "Active Orders",
      "Inventory Status",
      "Customer Satisfaction",
    ],
    datasets: [
      {
        label: "Store Metrics",
        data: [
          productCount,
          activeOrders,
          inventoryStatus, // as is, for visual proportion
          customerSatisfaction * 20, // convert 0-5 to percent
        ],
        backgroundColor: [
          "#e1a93c",
          "#ffe066",
          "#ffd700",
          "#bfff00",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            let value = context.raw;
            if (label === "Inventory Status" || label === "Customer Satisfaction") {
              value = label === "Customer Satisfaction" ? `${(value/20).toFixed(1)}/5` : `${value}%`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: 260 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
