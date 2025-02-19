#ifndef MODELS_MEMBER_H_
#define MODELS_MEMBER_H_

#include <string>

namespace models
{
    // 会员等级枚举
    enum class MemberLevel
    {
        REGULAR,
        SILVER,
        GOLD,
        PLATINUM
    };

    class Member
    {
    public:
        Member() = default;
        Member(const std::string &id,
               const std::string &name,
               const std::string &phone,
               const std::string &gender,
               MemberLevel level,
               double points,
               const std::string &card_number,
               const std::string &join_date);

        // Getters
        std::string GetId() const { return id_; }
        std::string GetName() const { return name_; }
        std::string GetPhone() const { return phone_; }
        std::string GetGender() const { return gender_; }
        MemberLevel GetLevel() const { return level_; }
        double GetPoints() const { return points_; }
        std::string GetCardNumber() const { return card_number_; }
        std::string GetJoinDate() const { return join_date_; }

        // Setters
        void SetLevel(MemberLevel level) { level_ = level; }
        void SetPoints(double points) { points_ = points; }

        // 业务方法
        void AddPoints(double points);
        bool UsePoints(double points);
        void UpdateLevel();

        // For mock data
        static Member CreateMockMember(int index);

    private:
        std::string id_;
        std::string name_;
        std::string phone_;
        std::string gender_;
        MemberLevel level_;
        double points_;
        std::string card_number_;
        std::string join_date_;
    };

} // namespace models

#endif // MODELS_MEMBER_H_