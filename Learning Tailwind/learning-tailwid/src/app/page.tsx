 export default function Home() {
  return (
    <div className="p-1.5 h-screen bg-slate-150 flex flex-col items-center dark:bg-slate-900">
      <div className="max-w-2xl text-center">
        <h1 className="text-gray-950 dark:text-gray-100 sm:text-3xl md:text-4xl lg:text-5xl font-bold text-3xl justify-center flex items-center gap-3 before:w-0.5 before:h-8 before:bg-sky-500 before:flex">
          Title - Learning Tailwind CSS
        </h1>
        <p className="text-gray-950 dark:text-gray-300 mt-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
        <button className="bg-sky-600 dark:bg-sky-400 px-4 py-2 rounded-lg text-white font-bold hover:bg-sky-600 mt-6 ml-6 hover:scale-105 transition-all">
          botão
        </button>
      </div>
    </div>
  );
}