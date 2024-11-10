'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    temperature: Math.round(15 + Math.sin(i / 24 * Math.PI * 2) * 5 + Math.random() * 2)
  }))
}

const generateDailyData = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDate = new Date()
  return days.map((day, index) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + index)
    return {
      day,
      date: date.toLocaleDateString(),
      temperature: Math.round(Math.random() * 10 + 20), // 20-30°C
      precipitation: Math.round(Math.random() * 50), // 0-50mm
      rainChance: Math.round(Math.random() * 100) // 0-100%
    }
  })
}

export default function WeatherStation() {
  const [hourlyData, setHourlyData] = useState(generateHourlyData())
  const [dailyData, setDailyData] = useState(generateDailyData())

  const refreshData = () => {
    setHourlyData(generateHourlyData())
    setDailyData(generateDailyData())
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">San Jose Weather Forecast</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        {dailyData.map((dayData, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{dayData.day}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{dayData.date}</p>
              <p className="text-xl">{dayData.temperature}°C</p>
              <p>Precipitation: {dayData.precipitation}mm</p>
              <p>Rain Chance: {dayData.rainChance}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <Button onClick={refreshData}>Refresh Data</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Temperature for San Jose</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis 
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}°C`, 'Temperature']}
                labelFormatter={(hour) => `${hour}:00`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--primary))"
                name="Temperature"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}