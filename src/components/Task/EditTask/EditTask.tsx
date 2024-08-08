import type React from 'react'
import { type ChangeEvent, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { z } from 'zod'
import { currentTaskContext } from '@/contexts/currentTaskContext'
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext'
import { UpdateTaskSchema } from '@/components/Task/schemas'
import { DateInput } from './DateInput'
import { useDeleteTask } from '@/utils/hooks/task/useDeleteTask'
import { useUpdateTask } from '@/utils/hooks/task/useUpdateTask'
import validate from '@/utils/functions/validate'
import { useTeamMembers } from '@/utils/hooks/team/useTeamMembers'

type FormFieldsType = z.infer<typeof UpdateTaskSchema>

const EditTask: React.FC = () => {
  const { t } = useTranslation()
  const { currentTeamId } = useContext(currentTeamIdContext)
  const { currentTask, setCurrentTask } = useContext(currentTaskContext)
  const { teamMembersData, teamMembersStatus } = useTeamMembers(currentTeamId, 'user')
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const initialFormValues: Partial<FormFieldsType> = {
    title: currentTask?.attributes.title || '',
    description: currentTask?.attributes.description || '',
    dueAt: currentTask?.attributes.dueAt || '',
    assigneeId: currentTask?.attributes.assigneeId || '',
    isCompleted: currentTask?.attributes.isCompleted || false,
  }

  const [formValues, setFormValues] = useState<Partial<FormFieldsType>>(initialFormValues)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormFieldsType, string>>>({})

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentTask) {
      setFormValues({
        ...initialFormValues,
        isCompleted: currentTask.attributes.isCompleted,
      })
    }
  }, [currentTask])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    let updatedValue: string | boolean = value
    if (type === 'checkbox') {
      updatedValue = (e.target as HTMLInputElement).checked
    } else if (type === 'date') {
      updatedValue = new Date(`${value}T00:00:00.000Z`).toISOString()
    }
    setFormValues(prev => ({ ...prev, [name]: updatedValue }))

    if (name === 'assigneeId' || name === 'isCompleted' || name === 'dueAt') {
      handleUpdate(name, updatedValue)
    }
  }

  const handleUpdate = (field: keyof FormFieldsType, value: string | boolean): void => {
    if (currentTask && currentTeamId) {
      const updatedFields = { [field]: value } as Partial<FormFieldsType>

      if (currentTask.attributes[field] !== value) {
        updateTask.mutate({ task: currentTask, data: updatedFields, teamId: currentTeamId })
      }
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const validatedData = validate<typeof UpdateTaskSchema>(formValues, UpdateTaskSchema)
    const foundError = validatedData.errors.find(i => i.path.join('.') === e.target.name)

    setFormErrors(prev => ({ ...prev, [e.target.name]: foundError ? foundError.message : '' }))

    if (!foundError) {
      handleUpdate(e.target.name as keyof FormFieldsType, e.target.value)
    }
  }

  const handleDelete = () => {
    if (currentTask && currentTeamId) {
      deleteTask.mutate({ task: currentTask, teamId: currentTeamId })
      setCurrentTask(undefined)
    }
  }

  return (
    <div className="relative m-auto w-full h-full bg-white dark:bg-neutral p-4 sm:p-8 xl:px-0 xl:pb-24">
      {/* Action buttons */}
      <div className="dropdown dropdown-end fixed right-12 top-20 text-primary">
        <div tabIndex={0} role="button">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
            <title>more icon</title>
          </svg>
        </div>
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-200 dark:bg-base-100 rounded-box w-52">
          <li><button type='button' onClick={handleDelete} className='text-error'>{t('delete task')}</button></li>
        </ul>
      </div>
      <button type="button" onClick={() => setCurrentTask(undefined)} className="fixed right-2 top-20 text-primary">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <title>cross icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className='overflow-y-auto h-full px-8 pt-4'>
        <form>
          <div className="mb-4">
            <label className="input flex -ml-4 mb-2 block font-medium text-black dark:text-white bg-transparent">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                name='title'
                className="grow text-2xl"
                value={formValues.title}
              />
            </label>
            {formErrors.title && <span className='text-sm text-red-500'>{t("title length error")}</span>}
          </div>

          <div className='mb-4'>
            <input
              type="checkbox"
              aria-label='completed-checkbox'
              name='isCompleted'
              checked={formValues.isCompleted}
              onChange={handleChange}
              className="checkbox checkbox-success mr-2 -mb-0.5 checkbox-xs"
            />
            <label className='text-black/50 dark:text-white/50'>{t('completed')}</label>
          </div>

          <div className='mb-4'>
            <label className='text-black/50 dark:text-white/50'>{t('assignee')}: </label>
            <select
              className="select select-ghost w-full -ml-4"
              value={formValues.assigneeId || 'Add Member'}
              onChange={handleChange}
              name="assigneeId"
            >
              {!formValues.assigneeId && <option value=''>Add Assignee</option>}
              {teamMembersStatus && teamMembersData?.map((member) => (
                member.attributes.hasUserAccepted && (
                  <option key={member.id} value={member.attributes.userId}>
                    {member.relationships.user.data.attributes.fullName}
                  </option>
                )
              ))}
            </select>
          </div>

          <div className='mb-4'>
            <label className='text-black/50 dark:text-white/50'>{t('due date')}: </label>
            <DateInput inputDate={currentTask?.attributes.dueAt} handleChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-medium text-black/50 dark:text-white/50">
              {t('description')}
            </label>
            <textarea
              className="-ml-4 textarea w-full bg-transparent"
              name='description'
              onBlur={handleBlur}
              onChange={handleChange}
              value={formValues.description}
            />
            {formErrors.description && <span className='text-sm text-red-500'>{t("description length error")}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTask