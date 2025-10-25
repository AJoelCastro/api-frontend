import Sidebar from '@/components/Sidebar';
import TextGenerationPage from "@/page-sections/text-generation";

export default function TextGeneration() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 transition-all duration-300 bg-slate-50 ">
        <TextGenerationPage/>
      </main>
    </div>
  );
}
