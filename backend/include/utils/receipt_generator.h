#ifndef UTILS_RECEIPT_GENERATOR_H_
#define UTILS_RECEIPT_GENERATOR_H_

#include <string>
#include "models/transaction.h"
#include "models/member.h"

namespace utils
{
    class ReceiptGenerator
    {
    public:
        static std::string GenerateReceipt(const models::Transaction &transaction,
                                           const models::Member *member = nullptr);

    private:
        static std::string GetStoreInfo();
        static std::string FormatDateTime(const std::string &timestamp);
        static std::string FormatCurrency(double amount);
        static std::string GetPaymentMethodString(models::PaymentMethod method);
        static std::string GenerateBarcode(const std::string &transaction_id);
    };

} // namespace utils

#endif // UTILS_RECEIPT_GENERATOR_H_