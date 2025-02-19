#ifndef UTILS_DATE_VALIDATOR_H_
#define UTILS_DATE_VALIDATOR_H_

#include <string>
#include <regex>

namespace utils
{
    class DateValidator
    {
    public:
        static bool IsValidDate(const std::string &date)
        {
            // 验证日期格式：YYYY-MM-DD
            std::regex date_pattern("^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])$");
            if (!std::regex_match(date, date_pattern))
            {
                return false;
            }

            // 解析年月日
            int year = std::stoi(date.substr(0, 4));
            int month = std::stoi(date.substr(5, 2));
            int day = std::stoi(date.substr(8, 2));

            // 检查月份天数
            if (month == 2)
            {
                // 闰年判断
                bool is_leap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
                if (day > (is_leap ? 29 : 28))
                {
                    return false;
                }
            }
            else if (month == 4 || month == 6 || month == 9 || month == 11)
            {
                if (day > 30)
                {
                    return false;
                }
            }

            return true;
        }

        static bool IsValidDateRange(const std::string &start_date, const std::string &end_date)
        {
            if (!start_date.empty() && !end_date.empty())
            {
                if (!IsValidDate(start_date) || !IsValidDate(end_date))
                {
                    return false;
                }

                // 比较日期大小
                return start_date <= end_date;
            }
            return true; // 允许空日期
        }
    };

} // namespace utils

#endif // UTILS_DATE_VALIDATOR_H_