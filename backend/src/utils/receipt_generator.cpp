#include "utils/receipt_generator.h"
#include <sstream>
#include <iomanip>

namespace utils
{
    std::string ReceiptGenerator::GenerateReceipt(
        const models::Transaction &transaction,
        const models::Member *member)
    {
        std::stringstream ss;

        // 店铺信息
        ss << GetStoreInfo() << "\n\n";

        // 交易信息
        ss << "交易编号: " << transaction.GetId() << "\n";
        ss << "时间: " << FormatDateTime(transaction.GetTimestamp()) << "\n";
        ss << "收银员: " << transaction.GetOperatorId() << "\n\n";

        // 会员信息
        if (member)
        {
            ss << "会员信息:\n";
            ss << "卡号: " << member->GetCardNumber() << "\n";
            ss << "姓名: " << member->GetName() << "\n";
            ss << "当前积分: " << member->GetPoints() << "\n\n";
        }

        // 商品明细
        ss << "商品明细:\n";
        ss << std::setw(20) << std::left << "商品名称"
           << std::setw(10) << std::right << "单价"
           << std::setw(8) << "数量"
           << std::setw(12) << "小计" << "\n";
        ss << std::string(50, '-') << "\n";

        for (const auto &item : transaction.GetItems())
        {
            ss << std::setw(20) << std::left << item.product_name
               << std::setw(10) << std::right << FormatCurrency(item.price)
               << std::setw(8) << item.quantity
               << std::setw(12) << FormatCurrency(item.subtotal) << "\n";
        }
        ss << std::string(50, '-') << "\n";

        // 合计信息
        ss << std::setw(30) << std::right << "商品总额: "
           << std::setw(20) << FormatCurrency(transaction.GetTotalAmount()) << "\n";

        if (transaction.GetPointsUsed() > 0)
        {
            ss << std::setw(30) << std::right << "积分抵扣: "
               << std::setw(20) << FormatCurrency(transaction.GetPointsUsed() * 0.1) << "\n";
        }

        ss << std::setw(30) << std::right << "实付金额: "
           << std::setw(20) << FormatCurrency(transaction.GetTotalAmount()) << "\n";

        if (transaction.GetPointsEarned() > 0)
        {
            ss << std::setw(30) << std::right << "本次获得积分: "
               << std::setw(20) << transaction.GetPointsEarned() << "\n";
        }

        // 支付方式
        ss << "\n支付方式: " << GetPaymentMethodString(transaction.GetPaymentMethod()) << "\n\n";

        // 条形码
        ss << GenerateBarcode(transaction.GetId()) << "\n\n";

        // 页脚
        ss << "感谢您的惠顾，欢迎再次光临！\n";
        ss << "请保留小票以便退换货\n";

        return ss.str();
    }

    std::string ReceiptGenerator::GetStoreInfo()
    {
        std::stringstream ss;
        ss << "示例超市\n";
        ss << "地址: 示例路123号\n";
        ss << "电话: 0123-4567890\n";
        return ss.str();
    }

    std::string ReceiptGenerator::FormatDateTime(const std::string &timestamp)
    {
        return timestamp; // 可以根据需要添加格式化逻辑
    }

    std::string ReceiptGenerator::FormatCurrency(double amount)
    {
        std::stringstream ss;
        ss << "￥" << std::fixed << std::setprecision(2) << amount;
        return ss.str();
    }

    std::string ReceiptGenerator::GetPaymentMethodString(models::PaymentMethod method)
    {
        switch (method)
        {
        case models::PaymentMethod::CASH:
            return "现金";
        case models::PaymentMethod::WECHAT:
            return "微信支付";
        case models::PaymentMethod::ALIPAY:
            return "支付宝";
        default:
            return "未知";
        }
    }

    std::string ReceiptGenerator::GenerateBarcode(const std::string &transaction_id)
    {
        // 这里可以实现实际的条形码生成逻辑
        return "||||| " + transaction_id + " |||||";
    }

} // namespace utils