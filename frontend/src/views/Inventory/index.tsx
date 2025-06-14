import { useEffect, useState } from "react";
import {
  getInventories,
  updateInventory,
  createInventory,
  deleteInventory,
  createInventoryRecord,
  getInventoryRecordsByInventoryId,
  type InventoryType,
  type InventoryRecordType,
} from "@/apis/inventory";
import { getUserInfo } from "@/apis/profile";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  purchasePrice: number;
  supplier: string;
  lastUpdated: string;
  status: "正常" | "偏低" | "紧缺" | "过剩";
}

interface StockRecord {
  id: string;
  itemId: string;
  type: "入库" | "出库";
  quantity: number;
  price: number;
  operator: string;
  date: string;
  notes: string;
}

const initialInventory: InventoryItem[] = [
  {
    id: "I001",
    name: "五花肉",
    category: "肉类",
    unit: "kg",
    currentStock: 25.5,
    minimumStock: 20,
    maximumStock: 100,
    purchasePrice: 32,
    supplier: "优质食材供应商",
    lastUpdated: "2024-01-20",
    status: "正常",
  },
  {
    id: "I002",
    name: "大米",
    category: "主食",
    unit: "kg",
    currentStock: 150,
    minimumStock: 100,
    maximumStock: 500,
    purchasePrice: 6,
    supplier: "粮油供应商",
    lastUpdated: "2024-01-19",
    status: "正常",
  },
  {
    id: "I003",
    name: "青菜",
    category: "蔬菜",
    unit: "kg",
    currentStock: 15,
    minimumStock: 20,
    maximumStock: 50,
    purchasePrice: 4,
    supplier: "蔬菜供应商",
    lastUpdated: "2024-01-20",
    status: "偏低",
  },
];

const categories = ["全部", "肉类", "蔬菜", "水产", "调味料", "主食", "其他"];

function Inventory() {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [stockRecords, setStockRecords] = useState<InventoryRecordType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryType | null>(null);
  const [showStockRecords, setShowStockRecords] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryType | null>(null);

  const [inventoryForm, setInventoryForm] = useState<Partial<InventoryType>>({
    item_name: "",
    item_category: "肉类",
    item_cost: "",
    max_stock: 0,
    min_stock: 0,
    quantity: 0,
    supplier: "",
  });

  const [recordForm, setRecordForm] = useState<Partial<InventoryRecordType>>({
    record_type: "入库",
    quantity: "",
    remark: "",
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      正常: "bg-green-100 text-green-800",
      偏低: "bg-yellow-100 text-yellow-800",
      紧缺: "bg-red-100 text-red-800",
      过剩: "bg-blue-100 text-blue-800",
    };
    return colors[status] || colors.正常;
  };

  const calculateStatus = (
    quantity: number,
    min_stock: number,
    max_stock: number
  ): string => {
    if (quantity <= min_stock * 0.3) return "紧缺";
    if (quantity <= min_stock) return "偏低";
    if (quantity >= max_stock) return "过剩";
    return "正常";
  };

  const filteredInventory = inventory.filter((item) => {
    const matchSearch = item.item_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "全部" || item.item_category === categoryFilter;
    const matchStatus = statusFilter === "全部" || item.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const onRecordClick = async (item: InventoryType) => {
    setSelectedItem(item);
    setShowStockRecords(true);
    const records = await getInventoryRecordsByInventoryId(item.inventory_id);

    const recordWithOperator = await Promise.all(
      records.map(async (record: InventoryRecordType) => {
        const { username } = await getUserInfo(record.operator_id);
        record.operator = username;
        return record;
      })
    );
    setStockRecords(recordWithOperator);
  };

  const handleInventorySubmit = async () => {
    try {
      const formData = {
        ...inventoryForm,
        status: calculateStatus(
          Number(inventoryForm.quantity || 0),
          Number(inventoryForm.min_stock || 0),
          Number(inventoryForm.max_stock || 0)
        ),
      };

      if (selectedItem) {
        await updateInventory(selectedItem.inventory_id, {
          ...selectedItem,
          ...formData,
        } as InventoryType);
      } else {
        await createInventory(formData as InventoryType);
      }
      const inventories = await getInventories();
      setInventory(inventories);
      setShowAddModal(false);
      setSelectedItem(null);
      setInventoryForm({
        item_name: "",
        item_category: "肉类",
        item_cost: "",
        max_stock: 0,
        min_stock: 0,
        quantity: 0,
        supplier: "",
      });
    } catch (error) {
      console.error("Failed to save inventory:", error);
      alert("保存失败");
    }
  };

  const handleRecordSubmit = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const userInfo = await getUserInfo(userId ? +userId : null);

      // 找到对应的物料
      const targetItem = inventory.find(
        (item) => item.inventory_id === Number(recordForm.item_id)
      );
      if (!targetItem) {
        throw new Error("物料不存在");
      }

      // 计算新的库存数量
      const changeAmount = Number(recordForm.quantity || 0);
      const newQuantity =
        recordForm.record_type === "入库"
          ? targetItem.quantity + changeAmount
          : targetItem.quantity - changeAmount;

      // 检查出库是否超过库存
      if (recordForm.record_type === "出库" && newQuantity < 0) {
        alert("库存不足，无法出库");
        return;
      }

      // 创建出入库记录
      await createInventoryRecord({
        ...recordForm,
        operator_id: userInfo.user_id,
        item_id: Number(recordForm.item_id),
      } as InventoryRecordType);

      // 更新物料库存和状态
      const updatedItem = {
        ...targetItem,
        quantity: newQuantity,
        status: calculateStatus(
          newQuantity,
          targetItem.min_stock,
          targetItem.max_stock
        ),
      };

      await updateInventory(targetItem.inventory_id, updatedItem);

      // 重新获取库存列表
      const inventories = await getInventories();
      setInventory(inventories);

      setShowRecordModal(false);
      setRecordForm({
        record_type: "入库",
        quantity: "",
        remark: "",
      });
    } catch (error) {
      console.error("Failed to create record:", error);
      alert("操作失败");
    }
  };

  const handleDeleteClick = (item: InventoryType) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await deleteInventory(itemToDelete.inventory_id);
      const inventories = await getInventories();
      setInventory(inventories);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      alert("删除失败");
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setInventoryForm({
        item_name: selectedItem.item_name,
        item_category: selectedItem.item_category,
        item_cost: selectedItem.item_cost,
        max_stock: selectedItem.max_stock,
        min_stock: selectedItem.min_stock,
        quantity: selectedItem.quantity,
        supplier: selectedItem.supplier,
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    const fetchInventories = async () => {
      const inventories = await getInventories();
      setInventory(inventories);
    };
    fetchInventories();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">库存管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {inventory.length} 个物料，
            {inventory.filter((i) => i.status !== "正常").length} 个需要关注
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowRecordModal(true)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            入库/出库
          </button>
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
            添加物料
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索物料..."
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
          <option value="全部">所有状态</option>
          <option value="正常">正常</option>
          <option value="偏低">偏低</option>
          <option value="紧缺">紧缺</option>
          <option value="过剩">过剩</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                物料信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                库存状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                采购信息
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.inventory_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.item_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.item_category} | kg
                    </div>
                    <div className="text-xs text-gray-400">
                      I00{item.inventory_id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="mb-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">
                    当前: {item.quantity}
                    kg
                  </div>
                  <div className="text-xs text-gray-500">
                    阈值: {item.min_stock}-{item.max_stock}
                    kg
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    采购价: ¥{item.item_cost}/kg
                  </div>
                  <div className="text-sm text-gray-500">{item.supplier}</div>
                  <div className="text-xs text-gray-400">
                    更新: {item.updated_at}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRecordClick(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    出入库记录
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowAddModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedItem ? "编辑物料" : "添加物料"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedItem(null);
                  setInventoryForm({});
                }}
                className="text-gray-400 hover:text-gray-500"
              >
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  物料名称
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={inventoryForm.item_name}
                  onChange={(e) =>
                    setInventoryForm((prev) => ({
                      ...prev,
                      item_name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  类别
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={inventoryForm.item_category}
                  onChange={(e) =>
                    setInventoryForm((prev) => ({
                      ...prev,
                      item_category: e.target.value,
                    }))
                  }
                >
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  采购价格
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={inventoryForm.item_cost}
                  onChange={(e) =>
                    setInventoryForm((prev) => ({
                      ...prev,
                      item_cost: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  供应商
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={inventoryForm.supplier}
                  onChange={(e) =>
                    setInventoryForm((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  最小库存
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={inventoryForm.min_stock}
                  onChange={(e) =>
                    setInventoryForm((prev) => ({
                      ...prev,
                      min_stock: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  最大库存
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={inventoryForm.max_stock}
                  onChange={(e) =>
                    setInventoryForm((prev) => ({
                      ...prev,
                      max_stock: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedItem(null);
                  setInventoryForm({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleInventorySubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Records Modal */}
      {showStockRecords && selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {selectedItem.item_name} 的出入库记录
              </h3>
              <button
                onClick={() => {
                  setShowStockRecords(false);
                  setSelectedItem(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
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

            <div className="mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      数量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作人
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      备注
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockRecords
                    .filter(
                      (record) => record.item_id === selectedItem.inventory_id
                    )
                    .map((record) => (
                      <tr key={record.item_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.created_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              record.record_type === "入库"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.record_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.quantity}
                          kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.operator}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.remark}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowStockRecords(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Record Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">记录出入库</h3>
              <button
                onClick={() => {
                  setShowRecordModal(false);
                  setRecordForm({});
                }}
                className="text-gray-400 hover:text-gray-500"
              >
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  物料
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={recordForm.item_id}
                  onChange={(e) =>
                    setRecordForm((prev) => ({
                      ...prev,
                      item_id: Number(e.target.value),
                    }))
                  }
                >
                  <option value="">请选择物料</option>
                  {inventory.map((item) => (
                    <option key={item.inventory_id} value={item.inventory_id}>
                      {item.item_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  类型
                </label>
                <div className="mt-1 flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="type"
                      value="入库"
                      checked={recordForm.record_type === "入库"}
                      onChange={(e) =>
                        setRecordForm((prev) => ({
                          ...prev,
                          record_type: e.target.value as "入库" | "出库",
                        }))
                      }
                    />
                    <span className="ml-2">入库</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      name="type"
                      value="出库"
                      checked={recordForm.record_type === "出库"}
                      onChange={(e) =>
                        setRecordForm((prev) => ({
                          ...prev,
                          record_type: e.target.value as "入库" | "出库",
                        }))
                      }
                    />
                    <span className="ml-2">出库</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  数量
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={recordForm.quantity}
                  onChange={(e) =>
                    setRecordForm((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  备注
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={recordForm.remark}
                  onChange={(e) =>
                    setRecordForm((prev) => ({
                      ...prev,
                      remark: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRecordModal(false);
                  setRecordForm({});
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleRecordSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">确认删除</h3>
              <p className="mt-2 text-sm text-gray-500">
                确定要删除 {itemToDelete.item_name} 吗？此操作无法撤销。
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
