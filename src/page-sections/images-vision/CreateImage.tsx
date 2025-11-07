"use client";
import React from "react";

/**
 * CreateImage
 *
 * UI-only component for the Images & Vision section.
 * Contains visual structure (title, prompt input, buttons) but no logic.
 */
const CreateImage: React.FC = () => {
  return (
    <section>
      <p className="text-sm text-gray-600 mb-4">Enter a prompt to generate an image.</p>

      <form className="space-y-4">
        <textarea
          rows={4}
          placeholder="Describe the image you want to create"
          className="w-full rounded-md border border-gray-200 p-3"
        />

        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-60"
          >
            Generate
          </button>
          <button type="button" className="text-sm text-gray-600">
            Reset
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateImage;
