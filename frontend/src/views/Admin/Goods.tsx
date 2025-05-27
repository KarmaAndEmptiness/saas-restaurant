import React, { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
  status: "上架" | "下架" | "售罄";
  sales: number;
  cost: number;
  updateTime: string;
}

const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "红烧狮子头",
    price: 38,
    category: "热菜",
    description: "精选猪肉制作，口感鲜美",
    image: "https://placekitten.com/200/200",
    stock: 100,
    status: "上架",
    sales: 289,
    cost: 15,
    updateTime: "2024-01-20",
  },
  {
    id: "2",
    name: "清炒时蔬",
    price: 18,
    category: "素菜",
    description: "新鲜时令蔬菜",
    image: "https://placekitten.com/201/201",
    stock: 50,
    status: "上架",
    sales: 156,
    cost: 5,
    updateTime: "2024-01-20",
  },
];

const categories = ["全部", "热菜", "凉菜", "海鲜", "素菜", "主食", "饮品"];

function Goods() {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sortBy, setSortBy] = useState<"sales" | "price" | "stock" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredItems = items
    .filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        categoryFilter === "全部" || item.category === categoryFilter;
      const matchStatus =
        statusFilter === "全部" || item.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      const factor = sortOrder === "asc" ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * factor;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "上架":
        return "bg-green-100 text-green-800";
      case "下架":
        return "bg-gray-100 text-gray-800";
      case "售罄":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">菜品管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {items.length} 个菜品，
            {items.filter((i) => i.status === "上架").length} 个在售
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          添加菜品
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索菜品..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {["全部", "上架", "下架", "售罄"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("-");
            setSortBy(field as any);
            setSortOrder(order as "asc" | "desc");
          }}
        >
          <option value="null">排序方式</option>
          <option value="sales-desc">销量高到低</option>
          <option value="sales-asc">销量低到高</option>
          <option value="price-desc">价格高到低</option>
          <option value="price-asc">价格低到高</option>
          <option value="stock-desc">库存多到少</option>
          <option value="stock-asc">库存少到多</option>
        </select>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">
                    ¥{item.price}
                  </p>
                  <p className="text-sm text-gray-500">成本: ¥{item.cost}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                <div>
                  <p>库存: {item.stock}</p>
                  <p>销量: {item.sales}</p>
                </div>
                <div className="text-right">
                  <p>
                    毛利率:{" "}
                    {(((item.price - item.cost) / item.price) * 100).toFixed(1)}
                    %
                  </p>
                  <p>更新: {item.updateTime}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-md"
                >
                  编辑
                </button>
                <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md">
                  {item.status === "上架" ? "下架" : "上架"}
                </button>
                <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md">
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || selectedItem) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedItem ? "编辑菜品" : "添加菜品"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">关闭</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Modal form fields would go here */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  菜品名称
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {/* Add more form fields as needed */}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goods;
