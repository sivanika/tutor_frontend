import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
)

export default function LearningChart({ progress }) {
  const data = {
    labels: progress.map(p => p.label),
    datasets: [
      {
        label: "Learning Progress",
        data: progress.map(p => p.value),
        borderColor: "rgb(74,139,111)",
        backgroundColor: "rgba(74,139,111,0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  }

  return (
    <div className="h-[200px]">
      <Line data={data} options={{ responsive: true }} />
    </div>
  )
}
