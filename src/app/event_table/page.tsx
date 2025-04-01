import axios from "axios";
import EventTableClient from "./client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getEvents() {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:3000";

    const response = await axios.get(`${baseUrl}/api/eventsendemail`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data) {
      throw new Error("Не удалось получить events");
    }

    return response.data;
  } catch (error) {
    console.error("Ошибка при получении events:", error);
    return [];
  }
}

export default async function EventTablePage() {
  const events = await getEvents();
  return <EventTableClient initialEvents={events} />;
}
