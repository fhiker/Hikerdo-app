import { useState } from 'react';
import CreateTask from '@/components/Task/CreateTask/CreateTask';
import PrivateLayout from '@/layouts/PrivateLayout';
import { createModalContext } from '@/contexts/modalOpenContext';
import { currentTaskContext } from '@/contexts/currentTaskContext';
import EditTask from '@/components/Task/EditTask/EditTask';
import type { TaskInterface } from '@/types/entities';
import { currentTaskListContextId } from '@/contexts/currentTaskListIdContext';
import TaskManagement from '@/components/DragAndDrop/DragAndDrop';

const ProjectPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentTaskListId, setCurrentTaskListId] = useState<string | undefined>(undefined);
    const [currentTask, setCurrentTask] = useState<TaskInterface | undefined>(undefined);

    return (
        <PrivateLayout>
            <createModalContext.Provider value={{ setIsCreateModalOpen, isCreateModalOpen }}>
                <currentTaskListContextId.Provider value={{ currentTaskListId, setCurrentTaskListId }}>
                    <currentTaskContext.Provider value={{ currentTask, setCurrentTask }}>
                        {isCreateModalOpen && <CreateTask />}
                        <div className={`border-l border-black fixed top-0 right-0 dark:bg-neutral z-40 w-full md:w-2/3 lg:w-1/3 h-full pt-20 transition-transform ${currentTask ? "translate-x-0" : "translate-x-full"}`}>
                            {currentTask && <EditTask />}
                        </div>
                        <TaskManagement />
                    </currentTaskContext.Provider>
                </currentTaskListContextId.Provider>
            </createModalContext.Provider>
        </PrivateLayout>
    );

}

export default ProjectPage;