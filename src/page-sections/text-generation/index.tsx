"use client";
import TextGenerationService from "@/services/TextGeneration";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SectionLayout from "@/components/SectionLayout";

const TextGenerationPage = () => {
    const [response, setResponse] = useState<any>(null);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        try {
            const response = await TextGenerationService.generateText(data.prompt);
            console.log(response);
            setResponse(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SectionLayout>
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
        </SectionLayout>
    );
};

export default TextGenerationPage;