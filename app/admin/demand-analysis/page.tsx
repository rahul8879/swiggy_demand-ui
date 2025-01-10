'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { addDays, format, subDays, addHours, addWeeks } from "date-fns"

// Fake data generation function
const generateFakeData = (startDate: Date, endDate: Date, product: string, location: string, demandType: string) => {
  const data = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    const baseQuantity = Math.floor(Math.random() * 100) + 50
    const actualQuantity = product === 'milk' ? baseQuantity * 2 : baseQuantity
    const forecastedQuantity = actualQuantity + Math.floor(Math.random() * 20) - 10
    
    let dateFormat = 'yyyy-MM-dd HH:mm'
    let nextDate = addHours(currentDate, 1)
    
    if (demandType === 'daily') {
      dateFormat = 'yyyy-MM-dd'
      nextDate = addDays(currentDate, 1)
    } else if (demandType === 'weekly') {
      dateFormat = 'yyyy-MM-dd'
      nextDate = addWeeks(currentDate, 1)
    }
    
    data.push({
      date: format(currentDate, dateFormat),
      actual: currentDate <= new Date() ? actualQuantity : null,
      forecasted: forecastedQuantity,
    })
    currentDate = nextDate
  }
  return data
}

export default function DemandAnalysisPage() {
  const [product, setProduct] = useState('milk')
  const [location, setLocation] = useState('bangalore')
  const [demandType, setDemandType] = useState('daily')
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 7),
  })
  const [data, setData] = useState(() => 
    generateFakeData(dateRange.from!, dateRange.to!, product, location, demandType)
  )

  const handleApplyFilters = () => {
    setData(generateFakeData(dateRange.from!, dateRange.to!, product, location, demandType))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Demand Analysis</h1>
      <div className="flex flex-wrap gap-4">
        <Select value={product} onValueChange={setProduct}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="milk">Milk</SelectItem>
            <SelectItem value="bread">Bread</SelectItem>
            <SelectItem value="eggs">Eggs</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
        <Select value={demandType} onValueChange={setDemandType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Demand Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly Demand</SelectItem>
            <SelectItem value="daily">Daily Demand</SelectItem>
            <SelectItem value="weekly">Weekly Demand</SelectItem>
          </SelectContent>
        </Select>
        <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#fc8019"
                strokeWidth={2}
                name="Actual"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="forecasted"
                stroke="#2563eb"
                strokeWidth={2}
                name="Forecasted"
                dot={false}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

