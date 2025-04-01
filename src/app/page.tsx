import Form from "./componets/Form";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/tizer.mp4" type="video/mp4" />
        Ваш браузер не поддерживает видео.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-blue-900 opacity-85 z-10"></div>

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20">
        <Form />
      </div>
    </div>
  );
}
