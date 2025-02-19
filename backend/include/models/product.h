#ifndef MODELS_PRODUCT_H_
#define MODELS_PRODUCT_H_

#include <string>

namespace models
{
    class Product
    {
    public:
        Product() = default;
        Product(const std::string &id,
                const std::string &name,
                const std::string &code,
                double price,
                int stock,
                const std::string &category,
                bool points_eligible);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetCode() const { return code_; }
        double GetPrice() const { return price_; }
        int GetStock() const { return stock_; }
        std::string GetCategory() const { return category_; }
        bool IsPointsEligible() const { return points_eligible_; }

        // Setters
        void SetStock(int stock) { stock_ = stock; }
        void SetPrice(double price) { price_ = price; }

        // 业务方法
        bool UpdateStock(int quantity);
        double CalculatePoints(double amount) const;

        // For mock data
        static Product CreateMockProduct(int index);

    private:
        std::string id_;
        std::string name_;
        std::string code_;
        double price_;
        int stock_;
        std::string category_;
        bool points_eligible_;
    };

} // namespace models

#endif // MODELS_PRODUCT_H_