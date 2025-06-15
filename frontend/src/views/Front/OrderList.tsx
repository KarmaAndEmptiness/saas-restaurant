import { useEffect, useState } from "react";
import { getOrders, type OrderType } from "@/apis/front/order";

function OrderList() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.order_id?.toString().includes(searchTerm) ||
      JSON.parse(order.order_detail || "{}").table_number?.includes(searchTerm);
    const matchStatus =
      statusFilter === "全部" || order.order_status === statusFilter;
    const orderDate = new Date(order.created_at);
    const today = new Date();
    const isToday =
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();
    const isThisWeek =
      orderDate >= new Date(today.setDate(today.getDate() - 7));
    const isThisMonth =
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();

    const matchDate =
      dateFilter === "all" ||
      (dateFilter === "today" && isToday) ||
      (dateFilter === "week" && isThisWeek) ||
      (dateFilter === "month" && isThisMonth);

    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">订单列表</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="搜索订单号或桌号..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="全部">全部状态</option>
            <option value="待确认">待确认</option>
            <option value="已确认">已确认</option>
            <option value="制作中">制作中</option>
            <option value="待派送">待派送</option>
            <option value="已完成">已完成</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrders.map((order) => {
            const orderDetail = JSON.parse(order.order_detail || "{}");
            return (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      订单号: {order.order_id}
                    </h3>
                    <p className="text-gray-600">
                      桌号: {orderDetail.table_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.order_status === "已完成"
                          ? "bg-green-100 text-green-800"
                          : order.order_status === "待确认"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.order_status}
                    </span>
                    <p className="text-gray-600 mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">订单详情</h4>
                      <ul className="space-y-2">
                        {orderDetail.items?.map((item: any, index: number) => (
                          <li
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.dish_name} x{item.quantity}
                            </span>
                            <span>¥{item.subtotal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="flex justify-between">
                        <span>支付方式:</span>
                        <span>{order.payment_method}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>支付状态:</span>
                        <span>{order.payment_status}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>小计:</span>
                        <span>¥{orderDetail.subtotal}</span>
                      </p>
                      {orderDetail.discount_amount && (
                        <p className="flex justify-between text-green-600">
                          <span>优惠:</span>
                          <span>-¥{orderDetail.discount_amount}</span>
                        </p>
                      )}
                      <p className="flex justify-between font-bold">
                        <span>总计:</span>
                        <span>¥{order.total_amount}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {order.remark && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium">备注:</p>
                    <p>{order.remark}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderList;
