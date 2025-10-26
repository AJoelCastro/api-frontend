"use client";
import TextGenerationService from "@/services/TextGeneration";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SectionLayout from "@/components/SectionLayout";

const TextGenerationPage = () => {
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch } = useForm<{
        prompt: string;
        model: string;
        temperature: number;
        maxTokens: number;
    }>({
        defaultValues: {
            prompt: "",
            model: "gpt-4o",
            temperature: 0.7,
            maxTokens: 256,
        },
    });

    const temperature = watch("temperature");

    const onSubmit = async (data: any) => {
        setError(null);
        setLoading(true);
        setResponse(null);
        try {
            console.log("Submitting data:", data);
            const res = await TextGenerationService.generateText(data);
            setResponse(res);
        } catch (err: any) {
            setError(err?.message || "Error generating text");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionLayout>
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-semibold mb-4">Text Generation</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                            Prompt
                        </label>
                        <textarea
                            id="prompt"
                            {...register("prompt", { required: true })}
                            rows={2}
                            className="w-full rounded-lg border border-gray-200 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-black dark:text-white bg-white dark:bg-black"
                            placeholder="Write a prompt to generate text (e.g. 'Write a short marketing blurb for a productivity app')"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                            <select
                                {...register("model")}
                                className="w-full rounded-md border border-gray-200 p-2"
                            >
                                <option value="gpt-4o" className="bg-white dark:bg-black">gpt-4o</option>
                                <option value="gpt-4o-mini" className="bg-white dark:bg-black">gpt-4o-mini</option>
                                <option value="gpt-3.5" className="bg-white dark:bg-black">gpt-3.5</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature <span className="text-xs text-gray-500">{Number(temperature).toFixed(2)}</span></label>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                {...register("temperature", { valueAsNumber: true })}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Tokens</label>
                            <input
                                type="number"
                                {...register("maxTokens", { valueAsNumber: true })}
                                className="w-full rounded-md border border-gray-200 p-2"
                                min={16}
                                max={3000}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {loading && (
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            )}
                            {loading ? "Generating..." : "Generate"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                setResponse(null);
                                setError(null);
                            }}
                            className="text-sm text-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                </form>

                {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

                {response && (
                    <div className="mt-6 p-4 bg-white dark:bg-black rounded-lg shadow">
                        <pre className="whitespace-pre-wrap text-gray-800 dark:text-white">{response.content?.[0]?.text ?? JSON.stringify(response)}</pre>
                    </div>
                )}
            </div>
        </SectionLayout>
    );
};

export default TextGenerationPage;