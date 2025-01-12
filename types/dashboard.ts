export interface DashboardData {
  total_orders: number
  average_order_value: number
  total_revenue: number
  average_feedback_score: number
  cancellation_rate: number
  top_products: {
    [key: string]: number
  }
  orders_by_location: {
    [key: string]: number
  }
  weather_impact: {
    [key: string]: number
  }
}
