"use client";
import ImagesVisionService from "@/services/ImagesVision";
import React, { useState } from "react";
import { useForm } from "react-hook-form";


const CreateImage: React.FC = () => {

  const {handleSubmit, register, reset, formState: { errors }} = useForm();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async(data: any) => {
    try{
      setLoading(true);
      setImageUrl(null);
      const response = await ImagesVisionService.generateImage(data);
      console.log("Image generated:", response);
      const imageData = response.data?.[0];
      if (imageData?.b64_json) {
        setImageUrl(`data:image/png;base64,${imageData.b64_json}`);
      } else if (imageData?.url) {
        setImageUrl(imageData.url);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  } 

  return (
    <section>
      <p className="text-sm text-gray-600 mb-4">Enter a prompt to generate an image.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          rows={4}
          {...register("prompt", { required: 'Please enter a prompt' })}
          placeholder="Describe the image you want to create"
          className={`w-full rounded-md border p-3 ${
            errors.prompt ? "border-red-500" : "border-gray-200"
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
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            className="text-sm text-gray-600"
            onClick={() => {
              reset();
              setImageUrl(null);
            }}
          >
            Reset
          </button>
        </div>
      </form>
       {/* Mostrar imagen generada */}
      {imageUrl && (
        <div className="mt-6 text-center">
          <p className="text-gray-700 mb-2">Generated Image:</p>
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded-md shadow-md w-full max-w-md mx-auto"
          />
        </div>
      )}
    </section>
  );
};

export default CreateImage;
