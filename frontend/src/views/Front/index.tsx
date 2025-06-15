import { useEffect, useState } from "react";
import { createOrder, type OrderType } from "@/apis/front/order";
import {
  getDishes,
  getRecommendedDishes,
  getDishCategories,
  getDishCategory,
  type Dish,
  type DishCategory,
} from "@/apis/admin/goods";

const baseurl = import.meta.env.VITE_API_BASE_URL;
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  available: boolean;
}

interface CartItem extends Dish {
  quantity: number;
}

interface OrderDetails {
  tableNumber: string;
  customerCount: number;
  utensils: number;
  notes: string;
  specialRequirements: string;
  paymentMethod: "现金" | "微信" | "支付宝" | "银行卡";
  membershipId?: string;
  status: "待确认" | "已确认" | "制作中" | "待派送" | "已完成";
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "红烧狮子头",
    price: 38,
    category: "热菜",
    description: "精选猪肉制作，口感鲜美",
    image: "https://placekitten.com/200/200",
    available: true,
  },
  {
    id: "2",
    name: "清炒时蔬",
    price: 18,
    category: "素菜",
    description: "新鲜时令蔬菜",
    image: "https://placekitten.com/201/201",
    available: true,
  },
  {
    id: "3",
    name: "龙井虾仁",
    price: 68,
    category: "海鲜",
    description: "龙井茶香配搭鲜虾",
    image: "https://placekitten.com/202/202",
    available: true,
  },
];

const recommendedItems: MenuItem[] = [
  {
    id: "r1",
    name: "今日特价推荐 - 粤式烧鸭",
    price: 58,
    category: "特色推荐",
    description: "限时特惠！使用秘制配方腌制的烧鸭",
    image: "https://placekitten.com/203/203",
    available: true,
  },
];

const categories = ["全部", "热菜", "凉菜", "海鲜", "素菜", "主食", "饮品"];
//@ts-ignore
const memberDiscounts = {
  normal: { discount: 0.95, description: "普通会员95折" },
  silver: { discount: 0.9, description: "白银会员9折" },
  gold: { discount: 0.85, description: "黄金会员85折" },
};

function PlaceOrder() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [recommendedDishes, setRecommendedDishes] = useState<Dish[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    tableNumber: "",
    customerCount: 1,
    utensils: 1,
    notes: "",
    specialRequirements: "",
    paymentMethod: "微信",
    status: "待确认",
  });
  const [membershipId, setMembershipId] = useState("");
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(1);

  const filteredItems = dishes.filter((item) => {
    const matchSearch = item.dish_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "全部" || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const addToCart = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.dish_id === item.dish_id
      );
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.dish_id === item.dish_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.dish_id !== itemId)
    );
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.dish_id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + +item.dish_price * item.quantity,
    0
  );

  const finalAmount = totalAmount * currentDiscount;

  const applyMembership = () => {
    if (membershipId.length === 8) {
      setCurrentDiscount(0.9);
    }
  };

  const handleSubmitOrder = async () => {
    if (!orderDetails.tableNumber) {
      alert("请输入桌号");
      return;
    }

    if (cart.length === 0) {
      alert("购物车为空");
      return;
    }

    // 构建订单详情对象
    const detailData = {
      table_number: orderDetails.tableNumber,
      customer_count: orderDetails.customerCount,
      utensils_count: orderDetails.utensils,
      special_requirements: orderDetails.specialRequirements,
      notes: orderDetails.notes,
      items: cart.map((item) => ({
        dish_id: item.dish_id,
        dish_name: item.dish_name,
        price: item.dish_price,
        quantity: item.quantity,
        subtotal: (+item.dish_price * item.quantity).toString(),
      })),
      member_id: membershipId,
      discount_rate: currentDiscount,
      subtotal: totalAmount.toString(),
      discount_amount: (totalAmount - finalAmount).toString(),
    };

    const orderData: OrderType = {
      order_status: orderDetails.status,
      payment_method: orderDetails.paymentMethod,
      payment_status: "待支付",
      total_amount: finalAmount.toString(),
      discount_ammout: (totalAmount - finalAmount).toString(),
      delivery_address: null,
      tenant_id: 1,
      user_id: 1,
      is_deleted: 0,
      remark: orderDetails.notes,
      order_detail: JSON.stringify(detailData),
    };

    try {
      await createOrder(orderData);
      setShowOrderStatus(true);
      setCart([]);
      setOrderDetails({
        tableNumber: "",
        customerCount: 1,
        utensils: 1,
        notes: "",
        specialRequirements: "",
        paymentMethod: "微信",
        status: "待确认",
      });
    } catch (error) {
      alert("提交订单失败");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchRecommendedDishes = async () => {
      const dishes = await getRecommendedDishes();
      setRecommendedDishes(dishes);
    };
    fetchRecommendedDishes();
  }, []);
  useEffect(() => {
    const fetchDishes = async () => {
      const dishes = await getDishes();
      setDishes(dishes);
    };
    fetchDishes();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">点餐系统</h1>
          <div className="mt-4 flex items-center space-x-4">
            <input
              type="text"
              placeholder="搜索菜品..."
              className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="桌号"
              className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">今日推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedDishes.map((item) => (
              <div
                key={item.dish_id}
                className="bg-white rounded-lg shadow-md p-4 border border-yellow-200"
              >
                <div className="relative">
                  <img
                    src={item.cover_img ? baseurl + item.cover_img : ""}
                    alt={item.dish_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                    特惠
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{item.dish_name}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-red-600 font-bold">
                      ¥{item.dish_price}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.dish_id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <img
                    src={item.cover_img ? baseurl + item.cover_img : ""}
                    alt={item.dish_name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.dish_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      ¥{item.dish_price}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  >
                    添加到购物车
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">订单详情</h2>

              {/* 购物车商品列表 */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  已选商品
                </h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm">购物车是空的</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.dish_id}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.cover_img ? baseurl + item.cover_img : ""}
                            alt={item.dish_name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {item.dish_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ¥{item.dish_price}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.dish_id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.dish_id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.dish_id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg
                              className="w-5 h-5"
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
                      </div>
                    ))}
                  </div>
                )}

                {cart.length > 0 && (
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => setCart([])}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      清空购物车
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    桌号
                  </label>
                  <input
                    type="text"
                    value={orderDetails.tableNumber}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        tableNumber: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    用餐人数
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={orderDetails.customerCount}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        customerCount: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    餐具数量
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={orderDetails.utensils}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        utensils: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  会员卡号
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={membershipId}
                    onChange={(e) => setMembershipId(e.target.value)}
                    className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    onClick={applyMembership}
                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100"
                  >
                    验证
                  </button>
                </div>
                {currentDiscount < 1 && (
                  <p className="mt-2 text-sm text-green-600">
                    已应用会员折扣！
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    特殊要求
                  </label>
                  <textarea
                    value={orderDetails.specialRequirements}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        specialRequirements: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                    placeholder="例：不要辣、过敏原等"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    订单备注
                  </label>
                  <textarea
                    value={orderDetails.notes}
                    onChange={(e) =>
                      setOrderDetails({
                        ...orderDetails,
                        notes: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={2}
                    placeholder="其他要求..."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>商品数量</span>
                    <span>
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}件
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>小计</span>
                    <span>¥{totalAmount}</span>
                  </div>
                  {currentDiscount < 1 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>会员折扣</span>
                      <span>
                        -¥{(totalAmount * (1 - currentDiscount)).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>实付金额</span>
                    <span className="text-indigo-600">
                      ¥{finalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                >
                  确认下单
                </button>
              </div>
            </div>
          </div>
        </div>

        {showOrderStatus && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">订单状态跟踪</h3>
              <div className="space-y-4">
                {["待确认", "已确认", "制作中", "待派送", "已完成"].map(
                  (status, index) => (
                    <div key={status} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{status}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
              <button
                onClick={() => setShowOrderStatus(false)}
                className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceOrder;
