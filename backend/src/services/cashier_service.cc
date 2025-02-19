#include "services/cashier_service.h"
#include <sstream>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <iostream>
namespace services
{
    CashierService::CashierService()
    {
        InitializeMockData();
    }

    void CashierService::InitializeMockData()
    {
        // 生成模拟商品数据
        for (int i = 0; i < 100; ++i)
        {
            mock_products_.push_back(models::Product::CreateMockProduct(i));
        }

        // 生成模拟会员数据
        for (int i = 0; i < 50; ++i)
        {
            mock_members_.push_back(models::Member::CreateMockMember(i));
        }

        // 生成模拟交易数据
        for (int i = 0; i < 200; ++i)
        {
            mock_transactions_.push_back(models::Transaction::CreateMockTransaction(i));
        }
    }

    std::vector<models::Product> CashierService::SearchProducts(const std::string &keyword)
    {
        std::vector<models::Product> results;
        for (const auto &product : mock_products_)
        {
            if (product.GetName().find(keyword) != std::string::npos ||
                product.GetCode().find(keyword) != std::string::npos)
            {
                results.push_back(product);
            }
        }
        return results;
    }

    models::Product CashierService::GetProductByCode(const std::string &code)
    {
        auto it = std::find_if(mock_products_.begin(), mock_products_.end(),
                               [&code](const models::Product &product)
                               {
                                   return product.GetCode() == code;
                               });
        if (it != mock_products_.end())
        {
            return *it;
        }
        return models::Product();
    }

    std::string CashierService::CreateTransaction(const models::Transaction &transaction)
    {
        if (!ValidateTransaction(transaction))
        {
            return "";
        }

        // 更新库存
        for (const auto &item : transaction.GetItems())
        {
            if (!UpdateStock(item.product_id, -item.quantity))
            {
                return "";
            }
        }

        // 更新会员积分
        if (!transaction.GetMemberId().empty())
        {
            UpdateMemberPoints(transaction.GetMemberId(),
                               transaction.GetPointsEarned() - transaction.GetPointsUsed());
        }

        // 保存交易记录
        mock_transactions_.push_back(transaction);
        return transaction.GetId();
    }

    models::Transaction CashierService::GetTransactionById(const std::string &transaction_id)
    {
        auto it = std::find_if(mock_transactions_.begin(), mock_transactions_.end(),
                               [&transaction_id](const models::Transaction &transaction)
                               {
                                   return transaction.GetId() == transaction_id;
                               });
        if (it != mock_transactions_.end())
        {
            return *it;
        }
        return models::Transaction();
    }

    bool CashierService::UpdateStock(const std::string &product_id, int quantity)
    {
        auto it = std::find_if(mock_products_.begin(), mock_products_.end(),
                               [&product_id](const models::Product &product)
                               {
                                   return product.GetId() == product_id;
                               });
        if (it != mock_products_.end())
        {
            return it->UpdateStock(quantity);
        }
        return false;
    }

    models::Member CashierService::GetMemberByCard(const std::string &card_number)
    {
        auto it = std::find_if(mock_members_.begin(), mock_members_.end(),
                               [&card_number](const models::Member &member)
                               {
                                   return member.GetCardNumber() == card_number;
                               });
        if (it != mock_members_.end())
        {
            return *it;
        }
        return models::Member();
    }

    models::Member CashierService::GetMemberByPhone(const std::string &phone)
    {
        auto it = std::find_if(mock_members_.begin(), mock_members_.end(),
                               [&phone](const models::Member &member)
                               {
                                   return member.GetPhone() == phone;
                               });
        if (it != mock_members_.end())
        {
            return *it;
        }
        return models::Member();
    }

    models::Member CashierService::GetMemberById(const std::string &member_id)
    {
        auto it = std::find_if(mock_members_.begin(), mock_members_.end(),
                               [&member_id](const models::Member &member)
                               {
                                   return member.GetId() == member_id;
                               });
        if (it != mock_members_.end())
        {
            return *it;
        }
        return models::Member();
    }
    models::Member CashierService::GetMemberById(const std::string &&member_id)
    {
        return GetMemberById(member_id);
    }
    std::string CashierService::CreateMember(const models::Member &member)
    {
        if (!ValidateMember(member))
        {
            return "";
        }

        mock_members_.push_back(member);
        return member.GetId();
    }

    bool CashierService::UpdateMemberPoints(const std::string &member_id, double points_change)
    {
        auto it = std::find_if(mock_members_.begin(), mock_members_.end(),
                               [&member_id](const models::Member &member)
                               {
                                   return member.GetId() == member_id;
                               });
        if (it != mock_members_.end())
        {
            if (points_change >= 0)
            {
                it->AddPoints(points_change);
            }
            else
            {
                return it->UsePoints(-points_change);
            }
            return true;
        }
        return false;
    }

    double CashierService::CalculatePointsDiscount(double points)
    {
        // 假设1积分 = 0.1元
        return points * 0.1;
    }

    double CashierService::CalculateEarnedPoints(const std::vector<models::TransactionItem> &items)
    {
        double total_points = 0.0;
        for (const auto &item : items)
        {
            auto product = GetProductByCode(item.product_id);
            if (product.IsPointsEligible())
            {
                total_points += item.subtotal;
            }
        }
        return total_points;
    }

    bool CashierService::ValidateTransaction(const models::Transaction &transaction)
    {
        // 验证交易数据
        if (transaction.GetItems().empty())
        {
            return false;
        }

        // 验证商品库存
        for (const auto &item : transaction.GetItems())
        {
            auto product = GetProductByCode(item.product_id);
            if (product.GetStock() < item.quantity)
            {
                return false;
            }
        }

        return true;
    }

    bool CashierService::ValidateMember(const models::Member &member)
    {
        // 验证会员数据
        if (member.GetPhone().empty() || member.GetName().empty())
        {
            return false;
        }

        // 验证手机号是否已存在
        auto it = std::find_if(mock_members_.begin(), mock_members_.end(),
                               [&member](const models::Member &existing)
                               {
                                   return existing.GetPhone() == member.GetPhone();
                               });
        if (it != mock_members_.end())
        {
            return false;
        }

        return true;
    }

    std::vector<models::Member> CashierService::SearchMembers(const std::string &keyword)
    {
        // Implement the logic to search members by keyword
        std::cout << keyword << std::endl;
        return std::vector<models::Member>();
    }

    std::vector<models::Transaction> CashierService::GetMemberTransactions(const std::string &member_id, const std::string &start_date, const std::string &end_date)
    {
        // Implement the logic to get member transactions
        std::cout << member_id << std::endl;
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        return std::vector<models::Transaction>();
    }

    std::vector<models::Transaction> CashierService::GetTransactionHistory(const std::string &operator_id, const std::string &start_date, const std::string &end_date)
    {
        std::cout << operator_id << std::endl;
        std::cout << start_date << std::endl;
        std::cout << end_date << std::endl;
        // Implement the logic to get transaction history
        return std::vector<models::Transaction>();
    }
} // namespace services