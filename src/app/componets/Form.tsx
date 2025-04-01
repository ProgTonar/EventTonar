"use client";

import Image from "next/image";
import { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    name_biz: "",
    email: "",
    status: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Функция для проверки валидности email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent, status: string) => {
    e.preventDefault();

    // Проверка заполнения всех полей
    if (!formData.name || !formData.name_biz || !formData.email) {
      setSubmitStatus({
        success: false,
        message: "Пожалуйста, заполните все поля формы",
      });
      return;
    }

    // Проверка валидности email
    if (!isValidEmail(formData.email)) {
      setSubmitStatus({
        success: false,
        message: "Пожалуйста, введите корректный email",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const finalData = { ...formData, status };

    try {
      const response = await axios.post("/api/eventsendemail", finalData);

      toast.success("Спасибо! Ваши данные успешно отправлены");

      setFormData({ name: "", name_biz: "", email: "", status: "" });
    } catch (error) {
      console.error("Ошибка:", error);
      setSubmitStatus({
        success: false,
        message:
          "Произошла ошибка при отправке данных. Пожалуйста, попробуйте позже.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white h-[95%] w-[95%] md:w-[932px] md:h-[700px] rounded-[30px] md:p-[20px] overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/2 h-full md:rounded-[30px] flex flex-col relative overflow-hidden pl-4 pr-4 md:p-0">
        <ToastContainer />
        {/* Добавляем отображение ошибки */}
        {submitStatus && !submitStatus.success && (
          <div className="absolute top-4 left-0 right-0 flex justify-center z-50">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{submitStatus.message}</span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#EBF4FF] to-[#2269BB] z-0" />
        <div className="absolute inset-0 bg-[url(/bg_mobile.svg)] md:bg-[url(/bg.svg)] bg-cover md:bg-center bg-bottom z-10" />
        <div className="flex items-center justify-center p-[50px] z-11">
          <Image width={200} height={30} alt="" src="./logo.svg" />
        </div>
        <div className="md:flex hidden items-center justify-center text-[#0F53A9] font-sans text-3xl  text-center leading-[36px] font-[900] z-11">
          Приглашение на ежегодную презентацию предприятия
        </div>

        {/*Мобильная версия */}

        <div className="md:hidden flex items-center justify-center text-[#0F53A9] font-sans text-[20px] mt-4 text-center leading-[24px] font-[600] z-11">
          Рады пригласить вас на ежегодную презентацию «Тонар», которая
          состоится 23 апреля
        </div>
        <div className="md:hidden flex items-center justify-center text-[#273C50] font-sans text-[20px] mt-10 mb-5 text-center leading-[24px] font-[600] z-11">
          Ваши данные
        </div>

        <div className="md:hidden flex z-100">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col space-y-6 w-full px-8"
          >
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ФИО участника"
                className="border border-[#B3C3D2] rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F53A9] transition-all text-[#273C50]"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <input
                type="text"
                id="name_biz"
                name="name_biz"
                value={formData.name_biz}
                onChange={handleChange}
                placeholder="Наименование предприятия"
                className="border border-[#B3C3D2] rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F53A9] transition-all text-[#273C50]"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email участника"
                className="border border-[#B3C3D2] rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F53A9] transition-all text-[#273C50]"
                required
              />
            </div>

            <div className="flex flex-col space-y-4 pt-6 w-full max-w-md">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) => handleSubmit(e, "Подтверждаю участие")}
                className="w-full flex items-center justify-center gap-2 bg-[#00A764] text-white font-sans font-medium py-3 px-6 rounded-[16px] hover:bg-[#00A764]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F53A9] focus:ring-opacity-50 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
                ) : (
                  <AiOutlineCheck className="text-lg" />
                )}
                <span>Подтверждаю участие</span>
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={(e) =>
                  handleSubmit(e, "К сожалению, не смогу посетить")
                }
                className="w-full flex items-center justify-center gap-2 bg-[#E1E8F0] text-[#273C50] font-sans font-medium py-3 px-6 rounded-[16px] hover:bg-[#E1E8F0]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F53A9] focus:ring-opacity-50 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#273C50] border-r-transparent"></span>
                ) : null}
                <span>К сожалению, не смогу посетить</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/*Desktop версия */}

      <div className="w-1/2 hidden md:flex flex-col relative overflow-hidden p-6">
        <div className="flex items-center justify-center text-[#273C50] font-sans text-[20px] mt-10 text-center leading-[24px] font-[600] z-11">
          Рады пригласить вас на ежегодную презентацию «Тонар», которая
          состоится 23 апреля
        </div>
        <div className="flex items-center justify-center text-[#273C50] font-sans text-[20px] mt-20 mb-10 text-center leading-[24px] font-[600] z-11">
          Ваши данные
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col space-y-6 w-full px-8"
        >
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ФИО участника"
              className="border border-[#B3C3D2] rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F53A9] transition-all text-[#273C50]"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="text"
              id="name_biz"
              name="name_biz"
              value={formData.name_biz}
              onChange={handleChange}
              placeholder="Наименование предприятия"
              className="border border-[#B3C3D2] rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F53A9] transition-all text-[#273C50]"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email участника"
              className="border border-[#B3C3D2] rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0F53A9] transition-all text-[#273C50]"
              required
            />
          </div>

          <div className="flex flex-col space-y-4 pt-6 w-full max-w-md">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, "Подтверждаю участие")}
              className="w-full flex items-center justify-center gap-2 bg-[#00A764] text-white font-sans font-medium py-3 px-6 rounded-[16px] hover:bg-[#00A764]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F53A9] focus:ring-opacity-50 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
              ) : (
                <AiOutlineCheck className="text-lg" />
              )}
              <span>Подтверждаю участие</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e, "К сожалению, не смогу посетить")}
              className="w-full flex items-center justify-center gap-2 bg-[#E1E8F0] text-[#273C50] font-sans font-medium py-3 px-6 rounded-[16px] hover:bg-[#E1E8F0]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F53A9] focus:ring-opacity-50 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#273C50] border-r-transparent"></span>
              ) : null}
              <span>К сожалению, не смогу посетить</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
