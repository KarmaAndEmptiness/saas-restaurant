import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SalesData {
  name: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface CategorySales {
  name: string;
  value: number;
  color: string;
}

interface MembershipData {
  name: string;
  value: number;
  color: string;
}

const dailyData: SalesData[] = [
  { name: "周一", revenue: 3500, orders: 120, customers: 95 },
  { name: "周二", revenue: 4200, orders: 145, customers: 112 },
  { name: "周三", revenue: 3800, orders: 132, customers: 98 },
  { name: "周四", revenue: 4800, orders: 168, customers: 124 },
  { name: "周五", revenue: 5500, orders: 189, customers: 145 },
  { name: "周六", revenue: 6800, orders: 232, customers: 178 },
  { name: "周日", revenue: 6200, orders: 210, customers: 165 },
];

const categorySales: CategorySales[] = [
  { name: "热菜", value: 45, color: "#FF6B6B" },
  { name: "凉菜", value: 15, color: "#4ECDC4" },
  { name: "主食", value: 20, color: "#45B7D1" },
  { name: "饮品", value: 12, color: "#96CEB4" },
  { name: "其他", value: 8, color: "#FFEEAD" },
];

const membershipData: MembershipData[] = [
  { name: "普通会员", value: 350, color: "#6C757D" },
  { name: "白银会员", value: 180, color: "#ADB5BD" },
  { name: "黄金会员", value: 120, color: "#FFD700" },
  { name: "钻石会员", value: 50, color: "#00A6FB" },
];

// 添加一个自定义 Hook 用于计算容器宽度
function useContainerWidth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth - 48); // 减去内边距
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return { containerRef, width };
}

function Report() {
  const [timeRange, setTimeRange] = useState("week");
  const [dataType, setDataType] = useState("revenue");
  const { containerRef: trendChartRef, width: trendChartWidth } =
    useContainerWidth();
  const { containerRef: barChartRef, width: barChartWidth } =
    useContainerWidth();

  const KPICard = ({
    title,
    value,
    change,
    isPositive,
  }: {
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p
          className={`ml-2 text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? "↑" : "↓"} {change}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">报表中心</h1>
        <p className="mt-1 text-sm text-gray-500">
          查看餐厅运营数据分析和关键指标
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex space-x-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="today">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="quarter">本季度</option>
          <option value="year">本年</option>
        </select>

        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="revenue">营收</option>
          <option value="orders">订单</option>
          <option value="customers">客流</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="总营收"
          value="¥34,800"
          change="12.5%"
          isPositive={true}
        />
        <KPICard title="订单数" value="1,196" change="8.2%" isPositive={true} />
        <KPICard
          title="客单价"
          value="¥29.1"
          change="3.1%"
          isPositive={false}
        />
        <KPICard title="新增会员" value="48" change="15.4%" isPositive={true} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div
          ref={trendChartRef}
          className="bg-white p-6 rounded-lg shadow overflow-hidden"
        >
          <h3 className="text-lg font-medium mb-4">营收趋势</h3>
          <div className="w-full overflow-hidden">
            <LineChart
              width={trendChartWidth || 400}
              height={300}
              data={dailyData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="营收(元)"
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#82ca9d"
                name="订单数"
              />
            </LineChart>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">品类销售分布</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={categorySales}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {categorySales.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Member Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">会员等级分布</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={membershipData}
              cx={200}
              cy={150}
              outerRadius={100}
              dataKey="value"
              label
            >
              {membershipData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Popular Items */}
        <div
          ref={barChartRef}
          className="bg-white p-6 rounded-lg shadow overflow-hidden"
        >
          <h3 className="text-lg font-medium mb-4">热销菜品</h3>
          <div className="w-full overflow-hidden">
            <BarChart
              width={barChartWidth || 400}
              height={300}
              data={[
                { name: "红烧狮子头", sales: 289 },
                { name: "糖醋里脊", sales: 256 },
                { name: "宫保鸡丁", sales: 245 },
                { name: "水煮鱼", sales: 236 },
                { name: "麻婆豆腐", sales: 228 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium mb-4">详细统计数据</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    营收
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    订单数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客流量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    客单价
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyData.map((day) => (
                  <tr key={day.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{day.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.customers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{(day.revenue / day.orders).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Report;
