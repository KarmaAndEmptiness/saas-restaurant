#include "models/product.h"
#include <sstream>

namespace models
{
    Product::Product(const std::string &id,
                     const std::string &name,
                     const std::string &code,
                     double price,
                     int stock,
                     const std::string &category,
                     bool points_eligible)
        : id_(id),
          name_(name),
          code_(code),
          price_(price),
          stock_(stock),
          category_(category),
          points_eligible_(points_eligible) {}

    bool Product::UpdateStock(int quantity)
    {
        if (stock_ + quantity >= 0)
        {
            stock_ += quantity;
            return true;
        }
        return false;
    }

    double Product::CalculatePoints(double amount) const
    {
        if (points_eligible_)
        {
            // 假设消费1元 = 1积分
            return amount;
        }
        return 0.0;
    }

    Product Product::CreateMockProduct(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        std::string category;
        double price;
        bool points_eligible;

        switch (index % 4)
        {
        case 0:
            category = "食品";
            price = 9.9;
            points_eligible = true;
            break;
        case 1:
            category = "饮料";
            price = 5.9;
            points_eligible = true;
            break;
        case 2:
            category = "日用品";
            price = 29.9;
            points_eligible = true;
            break;
        default:
            category = "烟酒";
            price = 99.9;
            points_eligible = false;
            break;
        }

        return Product(
            "p" + idx,             // id
            "商品" + idx,          // name
            "P" + idx + idx + idx, // code
            price,                 // price
            100 + index % 900,     // stock
            category,              // category
            points_eligible        // points_eligible
        );
    }

} // namespace models