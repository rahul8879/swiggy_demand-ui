'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { addDays, format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Generate historical and future data
const generateData = (
  baseValue: number,
  growthRate: number,
  marketConditions: number,
  competitorImpact: number
) => {
  const historicalDays = 15
  const futureDays = 45
  const pivotDate = new Date(2024, 0, 15)
  
  // Generate historical data with less variance
  const historicalData = Array.from({ length: historicalDays }).map((_, index) => ({
    date: format(addDays(new Date(2024, 0, 1), index), 'MMM dd'),
    Historical: baseValue + Math.sin(index * 0.5) * 2, // Smoother historical line
    A: null,
    B: null,
    C: null
  }))

  // Get the exact last historical value as starting point for all scenarios
  const startValue = historicalData[historicalData.length - 1].Historical

  // Generate future scenarios with straight lines
  const futureData = Array.from({ length: futureDays }).map((_, index) => {
    const daysPassed = index + 1
    
    // Calculate growth rates for each scenario
    const scenarioA = startValue * (1 + (growthRate + marketConditions)/100) ** (daysPassed/30)
    const scenarioB = startValue * (1 + growthRate/100) ** (daysPassed/30)
    const scenarioC = startValue * (1 + (growthRate - competitorImpact)/100) ** (daysPassed/30)
    
    return {
      date: format(addDays(pivotDate, index), 'MMM dd'),
      Historical: null,
      A: scenarioA,
      B: scenarioB,
      C: scenarioC
    }
  })

  return [...historicalData, ...futureData]
}

export default function ScenarioAnalysisPage() {
  const [baseValue, setBaseValue] = useState(100)
  const [growthRate, setGrowthRate] = useState(15)
  const [marketConditions, setMarketConditions] = useState(10)
  const [competitorImpact, setCompetitorImpact] = useState(5)
  const [product, setProduct] = useState('milk')
  const [location, setLocation] = useState('bangalore')
  
  const data = generateData(baseValue, growthRate, marketConditions, competitorImpact)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scenario Analysis</h1>
        <div className="flex gap-4">
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
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scenario Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Base Value</Label>
                    <Input 
                      type="number" 
                      value={baseValue}
                      onChange={(e) => setBaseValue(Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Growth Rate (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[growthRate]}
                        onValueChange={([value]) => setGrowthRate(value)}
                        min={-20}
                        max={50}
                        step={1}
                      />
                      <span className="w-12 text-sm">{growthRate}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Market Conditions Impact (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[marketConditions]}
                        onValueChange={([value]) => setMarketConditions(value)}
                        min={0}
                        max={50}
                        step={1}
                      />
                      <span className="w-12 text-sm">{marketConditions}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Competitor Impact (%)</Label>
                    <div className="flex items-center space-x-2">
                      <Slider
                        value={[competitorImpact]}
                        onValueChange={([value]) => setCompetitorImpact(value)}
                        min={0}
                        max={50}
                        step={1}
                      />
                      <span className="w-12 text-sm">{competitorImpact}%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Future Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
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
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="Historical"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="A"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="B"
                    stroke="#fb923c"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="C"
                    stroke="#fdba74"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                    <span className="text-sm font-medium">Scenario A</span>
                  </div>
                  <p className="text-sm text-gray-500">Optimistic case with favorable market conditions</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fb923c]" />
                    <span className="text-sm font-medium">Scenario B</span>
                  </div>
                  <p className="text-sm text-gray-500">Base case following current growth trajectory</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fdba74]" />
                    <span className="text-sm font-medium">Scenario C</span>
                  </div>
                  <p className="text-sm text-gray-500">Conservative case with competitor impact</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

