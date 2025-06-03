"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Pzt", twitch: 120, kick: 45 },
  { name: "Sal", twitch: 90, kick: 60 },
  { name: "Çar", twitch: 150, kick: 30 },
  { name: "Per", twitch: 80, kick: 90 },
  { name: "Cum", twitch: 200, kick: 120 },
  { name: "Cmt", twitch: 250, kick: 180 },
  { name: "Paz", twitch: 180, kick: 150 },
]

export default function ActivityChart() {
  return (
    <div className="h-64 w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} width={30} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              borderColor: "#374151",
              color: "#F9FAFB",
              fontSize: 12,
            }}
            labelStyle={{ color: "#F9FAFB" }}
            itemStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="twitch"
            name="Twitch (dk)"
            stroke="#9146FF"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line type="monotone" dataKey="kick" name="Kick (dk)" stroke="#00FF00" strokeWidth={2} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
