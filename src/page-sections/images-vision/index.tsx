"use client";
import SectionLayout from '@/components/SectionLayout'
import React, { useState } from 'react'
import CreateImage from './CreateImage'
import ProcessInputImages from './ProcessInputImages'

type Mode = 'create-image' | 'process-inputs'

const ImagesVisionPage: React.FC = () => {
    const [mode, setMode] = useState<Mode>('create-image')

    return (
        <SectionLayout>
            <div className="max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-semibold mb-4">Images & Vision</h1>

                {/* Mode selector */}
                <div className="mb-4">
                    <div className="inline-flex rounded-md p-1">
                        <button
                            className={`px-4 py-2 rounded-md ${
                                mode === 'create-image' ? 'bg-black text-white' : 'text-gray-600'
                            }`}
                            onClick={() => setMode('create-image')}
                        >
                            Create Image
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md ${
                                mode === 'process-inputs' ? 'bg-black text-white' : 'text-gray-600'
                            }`}
                            onClick={() => setMode('process-inputs')}
                        >
                            Process Input Images
                        </button>
                    </div>
                </div>

                {/* Sections */}
                {mode === 'create-image' && <CreateImage />}
                {mode === 'process-inputs' && <ProcessInputImages />}
            </div>
        </SectionLayout>
    )
}

export default ImagesVisionPage
