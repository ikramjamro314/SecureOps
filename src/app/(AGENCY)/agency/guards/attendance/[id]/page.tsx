"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  ClipboardCheck,
  Clock,
  UserCircle,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { INITIAL_GUARDS } from "@/utils/mockStore";

const AttendancePage = () => {
  const { id } = useParams();
  const matchedGuard = INITIAL_GUARDS.find((g) => g.id === id || g.badgeId === id) || INITIAL_GUARDS[0];
  const [guardData, setGuardData] = useState({
    id: matchedGuard.badgeId,
    name: matchedGuard.name,
    shift: `${matchedGuard.shift} Shift`,
  });

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [data, setData] = useState<any>();
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`/api/agency/attendance`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch attendance data");
        const resData = await response.json();

        setAttendanceHistory(Array.isArray(resData?.attendance) ? resData.attendance : []);
        setData(resData);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchAttendanceData();
    }
  }, [id]);

  const handleCheckIn = async () => {
    setIsCheckedIn(true);
  };

  const displayName = data?.user?.name || matchedGuard.name;
  const displayBadgeId = matchedGuard.badgeId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
              Guard Attendance Portal
            </h1>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{currentTime}</span>
            </div>
          </div>

          {/* Guard Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-4">
                <UserCircle className="w-12 h-12 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Guard Name</p>
                  <p className="font-semibold text-lg text-gray-800">
                    {displayName}
                  </p>
                  <p className="font-mono text-xs text-blue-700 font-bold bg-blue-50 w-fit px-2 py-0.5 rounded mt-1">
                    Guard ID: {displayBadgeId}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-4">
                <Calendar className="w-12 h-12 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Current Shift</p>
                  <p className="font-semibold text-gray-800">Night</p>
                </div>
              </div>
            </div>
          </div>

          {/* Check-In Button */}
          <div className="mt-6 flex justify-center"></div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            This Week's Attendance History
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Check-in Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.map((record: any, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.checkIn}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          record.status === "Present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        } px-3 py-1 inline-flex items-center gap-1 text-xs font-medium rounded-full`}
                      >
                        {record.present == true ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Night
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {record.checkIn || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
