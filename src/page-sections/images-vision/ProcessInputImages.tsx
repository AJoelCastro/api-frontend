"use client";
import React from "react";

/**
 * ProcessInputImages
 *
 * UI-only component for handling input images in the Images & Vision section.
 * Contains a file selector and placeholders to show selected images. No logic included.
 */
const ProcessInputImages: React.FC = () => {
  return (
    <section>
      <p className="text-sm text-gray-600 mb-4">Select images from your computer to process.</p>

      <form className="space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm text-gray-600"
        />

        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-60"
          >
            Process
          </button>
          <button type="button" className="text-sm text-gray-600">
            Reset
          </button>
        </div>
      </form>

      <div className="mt-4 bg-gray-800 p-4 rounded-md shadow">
        <h3 className="font-medium mb-2">Selected Images</h3>
        <div className="text-sm text-gray-500">No images selected (UI placeholder)</div>
      </div>
    </section>
  );
};

export default ProcessInputImages;

