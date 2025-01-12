'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { addDays, format, subDays, parseISO, setHours } from "date-fns"

interface DataPoint {
  ds: string;
  y?: number;
  yhat?: number;
}

interface ForecastData {
  product: string;
  location: string;
  actual: DataPoint[];
  forecast: DataPoint[];
}

interface ForecastResponse {
  status: string;
  data: ForecastData[];
  message: string | null;
}

export default function DemandAnalysisPage() {
  const [product, setProduct] = useState('Milk')
  const [location, setLocation] = useState('Koramangala')
  const [frequency, setFrequency] = useState('daily')
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: addDays(new Date(), 30),
  })
  const [demandData, setDemandData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDemandData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://127.0.0.1:8000/forecast?products=${product}&locations=${location}&frequency=${frequency}`)
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data')
      }
      const data: ForecastResponse = await response.json()
      if (data.status === 'success' && data.data.length > 0) {
        const combinedData = [
          ...data.data[0].actual.map(point => ({ ...point, y: point.y })),
          ...data.data[0].forecast.map(point => ({ ...point, yhat: point.yhat }))
        ]
        setDemandData(combinedData)
      } else {
        setError('No forecast data available')
      }
    } catch (err) {
      setError('Error fetching forecast data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDemandData()
  }, [product, location, frequency])

  const handleApplyFilters = () => {
    fetchDemandData()
  }

  const formatXAxis = (tickItem: string) => {
    const date = parseISO(tickItem)
    if (frequency === 'hourly') {
      return format(setHours(date, 7), 'HH:mm')
    }
    return format(date, 'MMM dd')
  }

  const formatTooltipLabel = (value: string) => {
    const date = parseISO(value)
    if (frequency === 'hourly') {
      return format(date, 'MMM dd, yyyy HH:mm')
    }
    return format(date, 'MMM dd, yyyy')
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
            <SelectItem value="Milk">Milk</SelectItem>
            <SelectItem value="Bread">Bread</SelectItem>
            <SelectItem value="Eggs">Eggs</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Koramangala">Koramangala</SelectItem>
            <SelectItem value="Indiranagar">Indiranagar</SelectItem>
            <SelectItem value="Whitefield">Whitefield</SelectItem>
          </SelectContent>
        </Select>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
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
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={demandData}>
                <XAxis
                  dataKey="ds"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatXAxis}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Demand', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  labelFormatter={formatTooltipLabel}
                  formatter={(value: number, name: string) => [value.toFixed(2), name === 'y' ? 'Actual' : 'Forecast']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Actual"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="yhat"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Forecast"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

