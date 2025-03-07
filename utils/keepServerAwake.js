import fetch from "node-fetch";

// Функция для отправки запросов на сервер, чтобы избежать перехода в спящий режим
export function keepServerAwake() {
  const url = "https://makina-server.onrender.com"; // Замените на URL вашего приложения на Render

  setInterval(async () => {
    try {
      await fetch(url);
      console.log("Server is awake");
    } catch (error) {
      console.error("Error while keeping server awake:", error);
    }
  }, 5 * 60 * 1000); // Запрос будет отправляться каждые 5 минут
}
