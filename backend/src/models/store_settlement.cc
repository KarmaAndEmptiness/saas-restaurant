#include "models/store_settlement.h"
#include <sstream>

namespace models
{
    StoreSettlement::StoreSettlement(const std::string &id,
                                     const std::string &store_id,
                                     const std::string &period_start,
                                     const std::string &period_end,
                                     double amount,
                                     Status status,
                                     const std::string &bank_account,
                                     const std::string &bank_name,
                                     const std::string &remark)
        : id_(id),
          store_id_(store_id),
          period_start_(period_start),
          period_end_(period_end),
          amount_(amount),
          status_(status),
          bank_account_(bank_account),
          bank_name_(bank_name),
          remark_(remark) {}

    StoreSettlement StoreSettlement::CreateMockSettlement(int index)
    {
        std::stringstream ss;
        ss << index;
        std::string idx = ss.str();

        // 生成模拟数据
        return StoreSettlement(
            "s" + idx,                 // id
            "store" + idx,             // store_id
            "2024-01-01",              // period_start
            "2024-01-31",              // period_end
            10000.0 * (1 + index % 5), // amount
            Status::PENDING,           // status
            "622202100" + idx + idx,   // bank_account
            "中国工商银行",            // bank_name
            "1月份结算"                // remark
        );
    }

} // namespace models