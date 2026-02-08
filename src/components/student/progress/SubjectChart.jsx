import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default function SubjectChart({ sessions }) {
  // Simple grouping by level/subject from title
  const subjects = ["Math", "CS", "Physics", "Other"]

  const dataMap = {
    Math: 0,
    CS: 0,
    Physics: 0,
    Other: 0,
  }

  sessions.forEach(s => {
    const t = s.title.toLowerCase()
    if (t.includes("math")) dataMap.Math++
    else if (t.includes("data") || t.includes("python")) dataMap.CS++
    else if (t.includes("physics")) dataMap.Physics++
    else dataMap.Other++
  })

  const data = {
    labels: Object.keys(dataMap),
    datasets: [
      {
        label: "Sessions Count",
        data: Object.values(dataMap),
        backgroundColor: [
          "rgba(42, 77, 110, 0.7)",
          "rgba(138, 79, 125, 0.7)",
          "rgba(199, 107, 74, 0.7)",
          "rgba(74, 139, 111, 0.7)",
        ],
      },
    ],
  }

  return (
    <div className="h-[250px]">
      <Bar data={data} options={{ responsive: true }} />
    </div>
  )
}
