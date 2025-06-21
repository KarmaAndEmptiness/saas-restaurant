import { useEffect, useState } from "react";
import {
  getDishes,
  updateDish,
  deleteDish,
  //@ts-ignore
  getDishCategories,
  getDishCategory,
  type Dish,
  createDish,
} from "@/apis/admin/goods";
import { uploadFile } from "@/apis/upload";

const baseurl = import.meta.env.VITE_API_BASE_URL;

const initialMenuItems: Dish[] = [];
const categories = ["全部", "热菜", "凉菜", "海鲜", "素菜", "主食", "饮品"];

function Goods() {
  const [dishes, setDishes] = useState<Dish[]>(initialMenuItems);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Dish>>({
    dish_name: "",
    dish_price: "",
    cost_price: "",
    description: "",
    cover_img: null,
    dish_category_id: 0,
    status: "上架",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Dish | null>(null);
  const [sortBy, setSortBy] = useState<"sales" | "price" | "stock" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const uploadResult = await uploadFile({ file });
        // Only set the preview and form data after successful upload
        setImagePreview(baseurl + uploadResult.file_url);
        setFormData((prev) => ({
          ...prev,
          cover_img: uploadResult.file_url,
        }));
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("图片上传失败");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedItem) {
        console.log(formData);
        await updateDish(selectedItem.dish_id, formData as Dish);
      } else {
        formData.dish_category_id = formData.dish_category_id
          ? +formData.dish_category_id
          : 0;
        await createDish(formData as Dish);
      }
      const updatedDishes = await getDishes();
      setDishes(updatedDishes);
      setShowAddModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to save dish:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (dish: Dish) => {
    try {
      const newStatus = dish.status === "上架" ? "下架" : "上架";
      await updateDish(dish.dish_id, { ...dish, status: newStatus });
      const updatedDishes = await getDishes();
      setDishes(updatedDishes);
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleDelete = async (dishId: number) => {
    if (window.confirm("确定要删除这个菜品吗？")) {
      try {
        await deleteDish(dishId);
        const updatedDishes = await getDishes();
        setDishes(updatedDishes);
      } catch (error) {
        console.error("Failed to delete dish:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedItem) {
      setFormData(selectedItem);
      setImagePreview(
        selectedItem.cover_img ? baseurl + selectedItem.cover_img : ""
      );
    } else {
      setFormData({
        dish_name: "",
        dish_price: "",
        cost_price: "",
        description: "",
        cover_img: null,
        dish_category_id: 0,
        status: "上架",
      });
      setImagePreview("");
    }
  }, [selectedItem]);

  const filteredItems = dishes.filter((item) => {
    const matchSearch = item.dish_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === "全部" || item.category === categoryFilter;
    const matchStatus = statusFilter === "全部" || item.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });
  // .sort((a, b) => {
  //   if (!sortBy) return 0;
  //   const factor = sortOrder === "asc" ? 1 : -1;
  //   return (a[sortBy] - b[sortBy]) * factor;
  // });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dishes = await getDishes();
        dishes.forEach(async (dish: Dish) => {
          const category = await getDishCategory(dish.dish_category_id);
          dish.category = category.category_name || "未分类";
        });
        setDishes(dishes);
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">菜品管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {dishes.length} 个菜品，
            {dishes.filter((i) => i.status === "上架").length} 个在售
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
            key={item.dish_id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="relative">
              <img
                src={
                  (item.cover_img ? baseurl + item.cover_img : null) ||
                  "https://via.placeholder.com/300"
                }
                alt={item.dish_name}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  item.status || ""
                )}`}
              >
                {item.status}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.dish_name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-indigo-600">
                    ¥{item.dish_price}
                  </p>
                  <p className="text-sm text-gray-500">
                    成本: ¥{item.cost_price}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                <div>
                  <p>库存: {item?.stock || 0}</p>
                  <p>销量: {item?.sales || 0}</p>
                </div>
                <div className="text-right">
                  <p>
                    毛利率:{" "}
                    {(
                      ((+item.dish_price - +item.cost_price) /
                        +item.dish_price) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  {/* <p>更新: {item.updateTime}</p> */}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-md"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleStatusToggle(item)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-md"
                >
                  {item.status === "上架" ? "下架" : "上架"}
                </button>
                <button
                  onClick={() => handleDelete(item.dish_id)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || selectedItem) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    菜品名称
                  </label>
                  <input
                    type="text"
                    name="dish_name"
                    value={formData.dish_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    售价
                  </label>
                  <input
                    type="number"
                    name="dish_price"
                    value={formData.dish_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    成本价
                  </label>
                  <input
                    type="number"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分类
                  </label>
                  <select
                    name="dish_category_id"
                    value={formData.dish_category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={index}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    描述
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    图片
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    {imagePreview && (
                      <div className="relative w-24 h-24">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview("");
                            setFormData((prev) => ({
                              ...prev,
                              cover_img: null,
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center`}
                >
                  {loading && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {selectedItem ? "保存修改" : "添加菜品"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goods;
