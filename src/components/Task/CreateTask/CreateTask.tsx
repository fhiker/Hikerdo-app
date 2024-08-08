import validate from "@/utils/functions/validate";
import { CreateTaskSchema } from "@/components/Task/schemas";
import { type ChangeEvent, type FormEvent, useContext, useState } from "react";
import type { z } from "zod";
import { useCreateTask } from "@/utils/hooks/task/useCreateTask";
import { createModalContext } from "@/contexts/modalOpenContext";
import { currentTaskListContextId } from "@/contexts/currentTaskListIdContext";
import { useParams } from "react-router-dom";
import { currentTeamIdContext } from "@/contexts/currentTeamIdContext";
import { useTranslation } from "react-i18next";

type FormFieldsType = Record<keyof z.infer<typeof CreateTaskSchema>, string>

const CreateTask = () => {
    const { currentTeamId } = useContext(currentTeamIdContext)
    const { isCreateModalOpen, setIsCreateModalOpen } = useContext(createModalContext);
    const { currentTaskListId } = useContext(currentTaskListContextId);
    const formDefaultValues = { title: '', description: '', listId: currentTaskListId ? currentTaskListId : '', teamId: currentTeamId ? currentTeamId : '' }
    const [formValues, setFormValues] = useState<FormFieldsType>(formDefaultValues)
    const [formErrors, setFormErrors] = useState<FormFieldsType>(formDefaultValues)
    const createTask = useCreateTask()

    const { t } = useTranslation()

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleBlur(e: { target: { name: string | number; }; }) {
        const validatedData = validate<typeof CreateTaskSchema>(formValues, CreateTaskSchema)
        const found = validatedData.errors.find(i => i.path.join('.') === e.target.name)
        if (found) {
            setFormErrors({ ...formErrors, [e.target.name]: found.message })
        } else {
            setFormErrors({ ...formErrors, [e.target.name]: '' })
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const validatedData = validate<typeof CreateTaskSchema>(formValues, CreateTaskSchema)

        setFormErrors(formDefaultValues)

        if (validatedData.errors.length > 0) {
            const newErrors: Record<string, string> = {}

            for (const error of validatedData.errors) {
                const errTitle = error.path.join('.')
                newErrors[errTitle] = error.message
            }
            setFormErrors({ ...formErrors, ...newErrors })
            return
        }

        if (currentTaskListId) {
            createTask.mutate(validatedData.data)
            setIsCreateModalOpen(false)
        } else {
            //TODO: show error??
        }
    }

    return (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5">
            <div className="relative m-auto w-full md:w-1/3 rounded-md border border-black bg-white p-4 dark:bg-neutral sm:p-8 xl:p-10">
                <button type="button" onClick={() => setIsCreateModalOpen(!isCreateModalOpen)} className="absolute right-1 top-1 sm:right-5 sm:top-5">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>cross icon</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-black dark:text-white">
                            {t('title')}
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <input name="title" type="text" onBlur={handleBlur} onChange={handleChange} className="grow" placeholder={t('task title')} />
                        </label>
                        {formErrors.title && <span className="text-sm text-red-500">{t('title lenght error')}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="mb-2 block font-medium text-black dark:text-white">
                            {t('description')}
                        </label>
                        <textarea name="description" onBlur={handleBlur} className="textarea w-full textarea-bordered" onChange={handleChange} placeholder={t('task description')} />
                        {formErrors.description && <span className="text-sm text-red-500">{t('description lenght error')}</span>}
                    </div>
                    <button type='submit' className='w-full btn btn-primary text-white dark:text-black mb-4'>
                        <svg className="h-5 w-5 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <title>plus icon</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        {t('add task')}</button>
                </form>
            </div >
        </div>
    )
}

export default CreateTask