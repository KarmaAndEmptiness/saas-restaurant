#include "models/transaction.h"
#include <sstream>
#include <algorithm>
#include <iomanip>
#include <chrono>

namespace models
{
    Transaction::Transaction(const std::string &id,
                             const std::string &member_id,
                             const std::vector<TransactionItem> &items,
                             double total_amount,
                             double points_used,
                             double points_earned,
                             PaymentMethod payment_method,
                             const std::string &operator_id,
                             const std::string &timestamp)
        : id_(id),
          member_id_(member_id),
          items_(items),
          total_amount_(total_amount),
          points_used_(points_used),
          points_earned_(points_earned),
          payment_method_(payment_method),
          operator_id_(operator_id),
          timestamp_(timestamp) {}

    void Transaction::AddItem(const TransactionItem &item)
    {
        // 检查是否已存在该商品
        auto it = std::find_if(items_.begin(), items_.end(),
                               [&item](const TransactionItem &existing)
                               {
                                   return existing.product_id == item.product_id;
                               });

        if (it != items_.end())
        {
            // 更新现有商品数量
            it->quantity += item.quantity;
            it->subtotal = it->price * it->quantity;
        }
        else
        {
            // 添加新商品
            items_.push_back(item);
        }

        CalculateTotal();
    }

    void Transaction::RemoveItem(const std::string &product_id)
    {
        items_.erase(
            std::remove_if(items_.begin(), items_.end(),
                           [&product_id](const TransactionItem &item)
                           {
                               return item.product_id == product_id;
                           }),
            items_.end());

        CalculateTotal();
    }

    void Transaction::UpdateItemQuantity(const std::string &product_id, int quantity)
    {
        auto it = std::find_if(items_.begin(), items_.end(),
                               [&product_id](const TransactionItem &item)
                               {
                                   return item.product_id == product_id;
                               });

        if (it != items_.end())
        {
            it->quantity = quantity;
            it->subtotal = it->price * quantity;
            CalculateTotal();
        }
    }

    void Transaction::CalculateTotal()
    {
        total_amount_ = 0.0;
        for (const auto &item : items_)
        {
            total_amount_ += item.subtotal;
        }
    }

    void Transaction::ApplyPointsDiscount(double points)
    {
        // 假设1积分 = 0.1元
        double discount = points * 0.1;
        points_used_ = points;
        total_amount_ = std::max(0.0, total_amount_ - discount);
    }

    void Transaction::CalculateEarnedPoints()
    {
        // 假设消费1元 = 1积分
        points_earned_ = total_amount_;
    }

    Transaction Transaction::CreateMockTransaction(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 生成当前时间戳
        auto now = std::chrono::system_clock::now();
        auto now_time = std::chrono::system_clock::to_time_t(now);
        std::stringstream time_ss;
        time_ss << std::put_time(std::localtime(&now_time), "%Y-%m-%d %H:%M:%S");

        // 创建模拟交易项
        std::vector<TransactionItem> items;
        items.push_back({"p" + idx, "商品" + idx, 99.9, 2, 199.8});
        items.push_back({"p" + std::to_string(index + 1),
                         "商品" + std::to_string(index + 1),
                         49.9, 1, 49.9});

        return Transaction(
            "t" + idx,             // id
            "m" + idx,             // member_id
            items,                 // items
            249.7,                 // total_amount
            0,                     // points_used
            249.7,                 // points_earned
            PaymentMethod::WECHAT, // payment_method
            "op" + idx,            // operator_id
            time_ss.str()          // timestamp
        );
    }

} // namespace models