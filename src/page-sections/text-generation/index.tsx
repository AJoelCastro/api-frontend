"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const TextGenerationPage = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {

    }

    return (
        <main className="flex-1 transition-all duration-300 bg-slate-50 dark:bg-black ">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Enter prompt" />
                <input type="submit" value="Generate" />
            </form>
        </main>
    )
}
export default TextGenerationPage;