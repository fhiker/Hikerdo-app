import type React from 'react';
import { useState, useMemo, useContext, useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Draggable, type DragUpdate } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrickModeDroppable';
import { currentTeamIdContext } from '@/contexts/currentTeamIdContext';
import { useTaskLists } from '@/utils/hooks/tasklist/useTaskListsById';
import { useParams } from 'react-router-dom';
import { useTasks } from '@/utils/hooks/task/useTasks';
import { transformData } from '@/utils/functions/transformData';
import { useUpdateTasklist } from '@/utils/hooks/tasklist/useUpdateTasklist';
import { useUpdateTask } from '@/utils/hooks/task/useUpdateTask';
import { currentTaskContext } from '@/contexts/currentTaskContext';
import { useCreateTaskList } from '@/utils/hooks/tasklist/useCreateTasklist';
import { useTranslation } from 'react-i18next';
import { createModalContext } from '@/contexts/modalOpenContext';
import { currentTaskListContextId } from '@/contexts/currentTaskListIdContext';
import { UpdateTasklistSchema } from '../Task/schemas';
import validate from "@/utils/functions/validate";
import { useDeleteTasklist } from '@/utils/hooks/tasklist/useDeleteTasklist';

const TaskManagement = () => {
    const { setIsCreateModalOpen } = useContext(createModalContext)
    const { setCurrentTaskListId } = useContext(currentTaskListContextId);

    const { t } = useTranslation()

    const { id: projectId } = useParams<{ id: string }>();
    const { currentTeamId } = useContext(currentTeamIdContext);
    const { taskLists, taskListsStatus } = useTaskLists(projectId);
    const { tasks, tasksStatus } = useTasks(currentTeamId);
    const { setCurrentTask } = useContext(currentTaskContext)
    const createTaskList = useCreateTaskList()
    const updateTaskList = useUpdateTasklist();
    const deleteTaskList = useDeleteTasklist()
    const updateTask = useUpdateTask();
    const [titleError, setTitleError] = useState<{ message: string }>({ message: '' })
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [dragDisabled, setDragDisabled] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);

    const handleTitleClick = (listId: string) => {
        setEditingListId(listId);
    };

    const handleTitleBlur = (listId: string, newTitle: string) => {
        const data = { title: newTitle }
        const validatedData = validate<typeof UpdateTasklistSchema>(data, UpdateTasklistSchema)
        const foundError = validatedData.errors.find(i => i.path.join('.') === newTitle)

        if (foundError) {
            setTitleError({ ...titleError, message: foundError.message })
        } else {
            setTitleError({ message: '' })
            if (projectId)
                updateTaskList.mutate({ tasklistId: listId, data: validatedData.data, projectId: projectId })

            setEditingListId(null);
        }
    };

    const onEnterPress = (e: React.KeyboardEvent<HTMLInputElement>, listId: string, newTitle: string) => {
        if (e.key === 'Enter') {
            handleTitleBlur(listId, newTitle);
        }
    };

    useEffect(() => {
        if (editingListId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingListId]);

    const lists = useMemo(() => {
        if (taskListsStatus === 'success' && tasksStatus === 'success' && taskLists && tasks) {
            return transformData(taskLists, tasks.data);
        }
        return [];
    }, [taskLists, tasks, taskListsStatus, tasksStatus]);

    const handleRemove = (id: string) => {
        if (projectId)
            deleteTaskList.mutate({ tasklistId: id, projectId: projectId })
    }

    const onDragEnd = useCallback((result: DragUpdate) => {
        const { destination, type, draggableId } = result;

        if (!destination) return;

        if (type === 'LIST') {
            if (projectId) {
                setDragDisabled(true)
                updateTaskList.mutate(
                    { tasklistId: draggableId, data: { position: destination.index }, projectId },
                    {
                        onSuccess: () => {
                            setDragDisabled(false)
                        },
                        onError: () => {
                            setDragDisabled(false)
                        }
                    }
                );
            }
        } else {
            // Handle task movement
            const destListId = destination.droppableId;
            const taskToUpdate = tasks?.data.find((task) => task.id === draggableId);

            if (taskToUpdate && currentTeamId) {
                if (taskToUpdate.attributes.position !== destination.index || taskToUpdate.attributes.listId !== destListId) {
                    setDragDisabled(true)
                    updateTask.mutate({
                        task: taskToUpdate,
                        data: {
                            listId: destListId,
                            position: destination.index
                        },
                        teamId: currentTeamId
                    },
                        {
                            onSuccess: () => {
                                setDragDisabled(false)
                            },
                            onError: () => {
                                setDragDisabled(false)
                            }
                        });
                }
            }
        }

    }, [projectId, updateTaskList, updateTask, tasks, currentTeamId]);

    const addNewColumn = useCallback(() => {
        if (projectId)
            createTaskList.mutate({ title: t('new column'), projectId: projectId })
    }, [createTaskList, projectId, t]);

    if (taskListsStatus === 'pending' || tasksStatus === 'pending') {
        return <div>Loading...</div>;
    }

    if (taskListsStatus === 'error' || tasksStatus === 'error') {
        return <div>Error loading data</div>;
    }

    return (
        <div className="p-4 h-[88vh] mt-16 overflow-x-auto">
            <DragDropContext onDragEnd={onDragEnd}>
                <StrictModeDroppable droppableId="all-lists" type="LIST" direction="horizontal">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="flex h-full gap-4 min-w-max"
                        >
                            {lists.map((list, index) => (
                                <Draggable key={list.id} draggableId={list.id} isDragDisabled={dragDisabled} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={'flex flex-col w-80 h-full bg-transparent min-w-[350px] rounded-t-lg'}
                                        >
                                            <div className='flex justify-between'>
                                                <div {...provided.dragHandleProps} className='pb-4 flex flex-col'>
                                                    {editingListId === list.id ? (
                                                        <input
                                                            ref={inputRef}
                                                            type="text"
                                                            defaultValue={list.title}
                                                            onBlur={(e) => handleTitleBlur(list.id, e.target.value)}
                                                            onKeyUp={(e) => onEnterPress(e, list.id, e.currentTarget.value)}
                                                            className="input input-ghost mt-[9px] mb-[7px] h-8 text-xl bg-transparent"
                                                        />
                                                    ) : (
                                                        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                                        <span
                                                            onClick={() => handleTitleClick(list.id)}
                                                            className="my-2 dark:text-white text-black py-1 pl-px text-xl h-8 w-full cursor-pointer"
                                                        >
                                                            {list.title}
                                                        </span>
                                                    )}
                                                    {titleError.message && <span className='text-error'>{t('title lenght error')}</span>}
                                                </div>
                                                <div className={'text-primary'}>
                                                    <button type='button' onClick={() => handleRemove(list.id)}>
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <title>cross icon</title><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => {
                                                setIsCreateModalOpen(true)
                                                setCurrentTaskListId(list.id)
                                            }} className="btn bg-white dark:bg-neutral dark:text-white text-black text-2xl">+</button>
                                            <StrictModeDroppable droppableId={list.id} type="TASK">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className="flex-grow pt-2 overflow-y-auto"
                                                    >
                                                        {list.tasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} isDragDisabled={dragDisabled} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        onClick={() => {
                                                                            setCurrentTask(undefined)
                                                                            setTimeout(() => setCurrentTask(task), 250)
                                                                        }}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={`p-4 mb-2 bg-white dark:bg-neutral rounded-lg w-full ${snapshot.isDragging ? 'shadow-md' : ''} ${dragDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                    >
                                                                        {task.attributes.title}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </StrictModeDroppable>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            <StrictModeDroppable droppableId="add-column" type="TASK">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={'flex flex-col w-80 h-full rounded-lg justify-center items-center'}
                                    >
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-primary focus:outline-none"
                                            onClick={addNewColumn}
                                            disabled={dragDisabled}
                                        >
                                            + {t('add column')}
                                        </button>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </StrictModeDroppable>
                        </div>
                    )}
                </StrictModeDroppable>
            </DragDropContext>
        </div>
    );
};

export default TaskManagement;