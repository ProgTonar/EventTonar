"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

export interface EventProps {
  id: string;
  name: string;
  name_biz: string;
  status: string;
  registeredAt: string;
}

interface EventTableClientProps {
  initialEvents: EventProps[];
}

export default function EventTableClient({
  initialEvents,
}: EventTableClientProps) {
  const [events, setEvents] = useState<EventProps[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => {
    const confirmed = events.filter(
      (event) => event.status === "Подтверждаю участие"
    ).length;
    const declined = events.filter(
      (event) => event.status === "К сожалению, не смогу посетить"
    ).length;

    return {
      total: events.length,
      confirmed,
      declined,
      confirmedPercent:
        events.length > 0 ? Math.round((confirmed / events.length) * 100) : 0,
      declinedPercent:
        events.length > 0 ? Math.round((declined / events.length) * 100) : 0,
    };
  }, [events]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    return events.slice(0, indexOfLastItem);
  }, [events, currentPage, itemsPerPage]);

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const hasMore = currentItems.length < events.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF4FF] to-[#2269BB] p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-[30px] shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <Image width={150} height={30} alt="Тонар" src="/logo.svg" />
          <h1 className="text-2xl font-bold text-[#0F53A9]">
            Список участников презентации
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4 text-center shadow">
            <h3 className="text-lg font-semibold text-[#0F53A9]">
              Всего заявок
            </h3>
            <p className="text-3xl font-bold text-[#273C50]">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center shadow">
            <h3 className="text-lg font-semibold text-green-800">
              Подтвердили участие
            </h3>
            <p className="text-3xl font-bold text-green-700">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center shadow">
            <h3 className="text-lg font-semibold text-red-800">Отказались</h3>
            <p className="text-3xl font-bold text-red-700">{stats.declined}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#0F53A9] border-r-transparent"></div>
            <p className="mt-4 text-[#273C50]">Загрузка данных...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-[#273C50]">
            Пока нет зарегистрированных участников
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead>
                <tr className="bg-[#EBF4FF] text-[#0F53A9]">
                  <th className="py-3 px-4 text-left">№</th>
                  <th className="py-3 px-4 text-left">ФИО участника</th>
                  <th className="py-3 px-4 text-left">
                    Наименование предприятия
                  </th>
                  <th className="py-3 px-4 text-left">Статус</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((event, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 text-black"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{event.name}</td>
                    <td className="py-3 px-4">{event.name_biz}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          event.status === "Подтверждаю участие"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-center">
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="bg-[#0F53A9] text-white px-6 py-2 rounded-lg hover:bg-[#0F53A9]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F53A9] focus:ring-opacity-50"
                >
                  Показать ещё
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
