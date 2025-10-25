"use client";
import Sidebar from "@/components/Sidebar";
import TextGenerationService from "@/services/TextGeneration";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

const TextGenerationPage = () => {
    const [response, setResponse] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(true);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await TextGenerationService.generateText(data.prompt);
            console.log(response);
            setResponse(response);
        } catch (error) {
            console.error(error);
        }
    }
    const onToggleSidebar = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);
    return (
        <>
            <Sidebar isOpen={isOpen} onToggleSidebar={onToggleSidebar}/>
            <div className={`flex-1 transition-all duration-300 bg-slate-50 dark:bg-black ${
            isOpen ? "ml-64" : "ml-0"
            }`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("prompt")} />
                    <input type="submit" value="Generate" />
                </form>
                {response && (
                    <div>
                        <h2>Generated Text:</h2>
                        <p>{response.content[0]?.text}</p>
                    </div>
                )}
            </div>
        </>

    )
}
export default TextGenerationPage;