import { useEffect, useState } from "react";
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type CampaignType,
} from "@/apis/member/campaign";
import { getMemberLevels, type MemberLevelType } from "@/apis/front/member";

function Campaign() {
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [memberLevels, setMemberLevels] = useState<MemberLevelType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("全部");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    campaign_name: "",
    campaign_content: "",
    campaign_start: "",
    campaign_end: "",
    level_id: 1,
    status: "进行中",
    tenant_id: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsData, levelsData] = await Promise.all([
          getCampaigns(),
          getMemberLevels(),
        ]);
        setCampaigns(campaignsData);
        setMemberLevels(levelsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchSearch =
      campaign.campaign_name.includes(searchTerm) ||
      campaign.campaign_content.includes(searchTerm);
    const matchStatus =
      statusFilter === "全部" || campaign.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.campaign_id, {
          ...selectedCampaign,
          ...formData,
        } as CampaignType);
      } else {
        await createCampaign(formData as CampaignType);
      }
      const updatedCampaigns = await getCampaigns();
      setCampaigns(updatedCampaigns);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedCampaign) {
      try {
        await deleteCampaign(selectedCampaign.campaign_id);
        setCampaigns(
          campaigns.filter(
            (c) => c.campaign_id !== selectedCampaign.campaign_id
          )
        );
        setShowDeleteModal(false);
        setSelectedCampaign(null);
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      campaign_name: "",
      campaign_content: "",
      campaign_start: "",
      campaign_end: "",
      level_id: 1,
      status: "进行中",
      tenant_id: 1,
    });
    setSelectedCampaign(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      进行中: "bg-green-100 text-green-800",
      已结束: "bg-gray-100 text-gray-800",
      未开始: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors] || colors["已结束"];
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">营销活动管理</h1>
          <p className="mt-1 text-sm text-gray-600">
            共 {campaigns.length} 个活动，
            {campaigns.filter((c) => c.status === "进行中").length} 个进行中
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          新建活动
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索活动名称或内容..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="全部">所有状态</option>
          <option value="进行中">进行中</option>
          <option value="未开始">未开始</option>
          <option value="已结束">已结束</option>
        </select>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                活动名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                活动时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                适用会员等级
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {campaign.campaign_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {campaign.campaign_content}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{campaign.campaign_start}</div>
                  <div>{campaign.campaign_end}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {
                    memberLevels.find((l) => l.level_id === campaign.level_id)
                      ?.level_name
                  }
                  会员
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      campaign.status
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setFormData({
                        campaign_name: campaign.campaign_name,
                        campaign_content: campaign.campaign_content,
                        campaign_start: campaign.campaign_start,
                        campaign_end: campaign.campaign_end,
                        level_id: campaign.level_id,
                        status: campaign.status,
                        tenant_id: campaign.tenant_id,
                      });
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedCampaign ? "编辑活动" : "新建活动"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  活动名称
                </label>
                <input
                  type="text"
                  value={formData.campaign_name}
                  onChange={(e) =>
                    setFormData({ ...formData, campaign_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  活动内容
                </label>
                <textarea
                  value={formData.campaign_content}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      campaign_content: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    开始时间
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.campaign_start}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        campaign_start: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    结束时间
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.campaign_end}
                    onChange={(e) =>
                      setFormData({ ...formData, campaign_end: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  适用会员等级
                </label>
                <select
                  value={formData.level_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level_id: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {memberLevels.map((level) => (
                    <option key={level.level_id} value={level.level_id}>
                      {level.level_name}会员
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  活动状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="未开始">未开始</option>
                  <option value="进行中">进行中</option>
                  <option value="已结束">已结束</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
            <p className="text-sm text-gray-500 mb-4">
              确定要删除活动 "{selectedCampaign?.campaign_name}"
              吗？此操作无法撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCampaign(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaign;
