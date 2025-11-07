"use client";
import React from "react";
import { useForm } from "react-hook-form";


const CreateImage: React.FC = () => {

  const {handleSubmit, register, reset, formState: { errors }} = useForm();
  console.log("errors",errors);
  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    // Here you would typically call the service to generate the image
    
  }

  return (
    <section>
      <p className="text-sm text-gray-600 mb-4">Enter a prompt to generate an image.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          rows={4}
          {...register("prompt", { required: true})}
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
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
          >
            Generate
          </button>
          <button 
            type="button" 
            className="text-sm text-gray-600"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateImage;
