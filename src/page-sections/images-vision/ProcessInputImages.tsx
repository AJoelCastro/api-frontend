"use client";
import ImagesVisionService from "@/services/ImagesVision";
import React, { useState } from "react";
import { useForm } from "react-hook-form";


const ProcessInputImages: React.FC = () => {

  const {handleSubmit, register, reset, formState: { errors }} = useForm();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const onSubmit = async(data: any) => {
    try{
      setLoading(true);
      setAnalysisResult(null);
      const response = await ImagesVisionService.analyzeImage(data);
      // Extraer el texto del análisis de la respuesta
      const analysisText = response?.output?.[1]?.content?.[0]?.text || 
                           response?.data?.content?.[0]?.text ||
                           response?.text ||
                           JSON.stringify(response);
      setAnalysisResult(analysisText);
    } catch (error) {
      console.error("Error analyzing image:", error);
    } finally {
      setLoading(false);
    }
  } 

  return (
    <section>
      <p className="text-sm text-gray-600 mb-4">Select images from your computer to process or enter a URL Image.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          rows={1}
          {...register("imageUrl", { required: 'Please enter a URL image' })}
          placeholder="https://openai-documentation.vercel.app/images/cat_and_otter.png"
          className={`w-full rounded-md border p-3 ${
            errors.imageUrl ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm">{errors.imageUrl.message as string}</p>
        )}

        <div className="flex gap-3 items-center">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
          >
            {loading ? "Loading..." : "Analyze Image"}
          </button>
          <button
            type="button"
            className="text-sm text-gray-600"
            onClick={() => {
              reset();
            }}
          >
            Reset
          </button>
        </div>
      </form>
      
      {/* Mostrar resultado del análisis */}
      {analysisResult && (
        <div className="mt-6 bg-gray-800 p-4 rounded-md shadow">
          <h3 className="font-medium mb-3 text-lg">Image Analysis Result</h3>
          <p className="text-whiteleading-relaxed whitespace-pre-wrap">{analysisResult}</p>
        </div>
      )}
    </section>
  );
};

export default ProcessInputImages;

