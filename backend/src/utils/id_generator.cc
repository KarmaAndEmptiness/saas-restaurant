#include "utils/id_generator.h"
#include <sstream>
#include <iomanip>

namespace utils
{
    std::string GenerateId(const std::string &prefix)
    {
        static int counter = 0;
        std::stringstream ss;
        ss << prefix << std::setw(6) << std::setfill('0') << ++counter;
        return ss.str();
    }
} // namespace utils