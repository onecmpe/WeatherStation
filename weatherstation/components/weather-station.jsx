"use client";

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

const daysOfWeek = ["'Sunday'", "'Monday'", "'Tuesday'", "'Wednesday'", "'Thursday'", "'Friday'", "'Saturday'"]

const generateWeekData = (cityName) => {
  const currentDate = new Date()
  return daysOfWeek.map((day, index) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() + index)
    return {
      day,
      date: date.toLocaleDateString(),
      temperature: Math.round(Math.random() * 20 + 10), // 10-30°C
      precipitation: Math.round(Math.random() * 50), // 0-50mm
      rainChance: Math.round(Math.random() * 100) // 0-100%
    }
  })
}

export function WeatherStationJsx() {
  const [city, setCity] = useState("")
  const [weekData, setWeekData] = useState([])
  const [activeTab, setActiveTab] = useState("temperature")

  useEffect(() => {
    setWeekData(generateWeekData(city))
  }, [city])

  const handleCitySubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      setWeekData(generateWeekData(city))
    }
  }

  const refreshData = () => {
    setWeekData(generateWeekData(city))
  }

  const chartConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "hsl(var(--primary))",
    },
    precipitation: {
      label: "Precipitation (mm)",
      color: "hsl(var(--secondary))",
    },
    rainChance: {
      label: "Rain Chance (%)",
      color: "hsl(var(--accent))",
    },
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Weekly Weather Forecast</h1>
      
      <form onSubmit={handleCitySubmit} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Get Forecast</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        {weekData.map((dayData, index) => (
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
          <TabsTrigger value="rainChance">Rain Chance</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>
                {chartConfig[activeTab]?.label || "Unknown"} Chart {city && `for ${city}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weekData}>
                  <CartesianGrid strokeDasharray="3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.entries(chartConfig).map(([key, config]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={config.color}
                      name={config.label}
                      hide={activeTab !== key}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}