import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale, // 문자열 라벨을 위한 Scale
  Filler,
} from "chart.js";
import { useEffect, useRef, useState } from "react";

import { analysisApi } from "../../../shared/apis";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler
);

type Datum = { date: string; count: number };

interface IProps {
  title?: string;
  height?: number;
  start?: string;
  end?: string;
}

const VisitorChart = ({
  title = "일자별 방문자 수",
  height = 300,
  start,
  end,
}: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [data, setData] = useState<Datum[]>([]);

  useEffect(() => {
    const startDate = new Date(`${start}T00:00:00+09:00`).toISOString();
    const endDate = new Date(`${end}T23:59:59+09:00`).toISOString();
    analysisApi.getVisitorStats({ startDate, endDate }).then((res) => {
      if (res.success) setData(res.data);
    });
  }, [start, end]);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: sorted.map((d) => d.date), // 문자열 라벨 사용
        datasets: [
          {
            label: "방문자 수",
            data: sorted.map((d) => d.count),
            borderWidth: 2,
            tension: 0.25,
            pointRadius: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: !!title,
            text: title,
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.dataset.label}: ${ctx.parsed.y?.toLocaleString("ko-KR")}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "날짜",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              callback: (value) => Number(value).toLocaleString("ko-KR"),
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data, title]);

  return (
    <div style={{ height }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default VisitorChart;
