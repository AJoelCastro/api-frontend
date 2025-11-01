import SectionLayout from '@/components/SectionLayout';

export default function Home() {
  return (
    <SectionLayout>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold">OpenAI API Explorer</h1>
        <p className="text-sm text-gray-600 mt-2">Select a tool from the sidebar.</p>
      </div>
    </SectionLayout>
  );
}
