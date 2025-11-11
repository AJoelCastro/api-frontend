"use client";
import ImagesVisionService from "@/services/ImagesVision";
import React, { useState } from "react";
import { useForm } from "react-hook-form";


const ProcessInputImages: React.FC = () => {

  const {handleSubmit, register, reset, formState: { errors }} = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async(data: any) => {
    try{
      setLoading(true);
      const response = await ImagesVisionService.analyzeImage(data);
      console.log("Image generated:", response);
    } catch (error) {
      console.error("Error generating image:", error);
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
        {errors.prompt && (
          <p className="text-red-500 text-sm">{errors.prompt.message as string}</p>
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
      
    </section>
  );
};

export default ProcessInputImages;

