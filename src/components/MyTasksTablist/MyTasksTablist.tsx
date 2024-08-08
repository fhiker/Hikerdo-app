import { currentTeamIdContext } from "@/contexts/currentTeamIdContext";
import type { TaskInterface } from "@/types/entities";
import { formatDate } from "@/utils/functions/formatDate";
import { useTasks } from "@/utils/hooks/task/useTasks";
import { useCurrentUser } from "@/utils/hooks/useCurrentUser";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MyTasksTablist = () => {
    const { user, status: userStatus } = useCurrentUser();
    const { currentTeamId } = useContext(currentTeamIdContext);
    const [assignedTasks, setAssignedTasks] = useState<TaskInterface[]>([]);
    const { tasks, tasksStatus } = useTasks(currentTeamId);
    const { t } = useTranslation();

    useEffect(() => {
        if (tasksStatus === 'success' && tasks && user) {
            const userTasks = tasks.data.filter((task) =>
                task.relationships?.assignee?.data.id === user.id
            );
            setAssignedTasks(userTasks);
        }
    }, [tasksStatus, tasks, user]);

    if (tasksStatus === 'pending' || userStatus === 'pending') {
        return <div className='flex flex-col gap-4 p-4 justify-center'>
            <div className="skeleton h-6 w-full" data-testid="skeleton" />
        </div>
    }

    if (tasksStatus === 'error') {
        return <div>{t('error loading tasks')}</div>;
    }

    if (userStatus === 'error') {
        return <div>{t('error loading user data')}</div>;
    }

    return (
        <div className="overflow-y-auto px-4">
            <table className="table">
                <thead>
                    <tr>
                        <th>  {t('title')}</th>
                        <th>  {t('due at')}</th>
                        <th className="flex justify-end">  {t('completed')}</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedTasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.attributes.title}</td>
                            {task.attributes.dueAt ?
                                <td>{formatDate(task.attributes.dueAt)}</td>
                                :
                                <td>-</td>
                            }
                            <td className="flex justify-end">
                                < div className="form-control">
                                    <label className="cursor-default label">
                                        <input readOnly={true} type="checkbox" checked={task.attributes.isCompleted} className="checkbox cursor-default checkbox-sm checkbox-success" />
                                    </label>
                                </div>
                            </td>
                        </tr>

                    ))
                    }
                </tbody>
            </table>
        </div >
    );
}

export default MyTasksTablist;