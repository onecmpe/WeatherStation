'use client'

import React, { useState, useEffect } from 'react'
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

const fetchWeatherData = async () => {
  const response = await fetch(
    'https://api.open-meteo.com/v1/forecast?latitude=37.3394&longitude=-121.895&current=temperature_2m&hourly=temperature_2m&temperature_unit=fahrenheit&timezone=America/Los_Angeles'
  )
  return await response.json()
}

const formatHourlyData = (data) => {
  if (!data.hourly || !data.hourly.time || !data.hourly.temperature_2m) {
    console.error('Invalid data structure:', data)
    return []
  }

  // Get the current hour index
  const currentHour = new Date().getHours()
  const currentDate = new Date().setHours(currentHour, 0, 0, 0)

  // Find the index in the API data that corresponds to the current hour
  const startIndex = data.hourly.time.findIndex(time => 
    new Date(time).getTime() >= currentDate
  )

  // Return the next 24 hours of data
  return data.hourly.time
    .slice(startIndex, startIndex + 24)
    .map((time, index) => ({
      hour: new Date(time).getHours(),
      temperature: Math.round(data.hourly.temperature_2m[startIndex + index])
    }))
}

const generateDailyData = (hourlyData) => {
  if (!hourlyData.hourly || !hourlyData.hourly.time || !hourlyData.hourly.temperature_2m) {
    console.error('Invalid hourly data structure:', hourlyData)
    return []
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDate = new Date()
  const currentDay = currentDate.getDay()
  
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + index)
    
    // Get the 24-hour block for this day
    const startIndex = index * 24
    const temperatures = hourlyData.hourly.temperature_2m.slice(startIndex, startIndex + 24)
    const avgTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length

    return {
      day: days[(currentDay + index) % 7],
      date: date.toLocaleDateString(),
      temperature: Math.round(avgTemp)
    }
  })
}

export default function WeatherStation() {
  const [hourlyData, setHourlyData] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await fetchWeatherData()
      console.log('API Response:', data) // Debug log
      const formattedHourlyData = formatHourlyData(data)
      console.log('Formatted Hourly Data:', formattedHourlyData) // Debug log
      setHourlyData(formattedHourlyData)
      setDailyData(generateDailyData(data))
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading weather data...</div>
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
              <p className="text-xl">{dayData.temperature}°F</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <Button onClick={fetchData}>Refresh Data</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Day By Day Temperature for San Jose</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={hourlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis 
                domain={['auto', 'auto']}
                label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value}°F`, 'Temperature']}
                labelFormatter={(hour) => `${hour}:00`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}