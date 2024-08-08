import type { List, TaskInterface, TaskListInterface } from '@/types/entities';

export function transformData(listsData: TaskListInterface[], tasksData: TaskInterface[]): List[] {
  const listMap: { [key: string]: List } = {};

  // Initialize the lists
  // biome-ignore lint/complexity/noForEach: <explanation>
  listsData.forEach((list) => {
    if (list.attributes?.id) {
      console.log(list);
      listMap[list.attributes.id] = {
        id: list.attributes.id,
        title: list.attributes.title,
        position: list.attributes.position,
        tasks: [],
      };
    }
  });

  // biome-ignore lint/complexity/noForEach: <explanation>
  tasksData.forEach((task) => {
    const listId = task.attributes.listId;
    if (listMap[listId]) {
      listMap[listId].tasks.push(task);
    }
  });

  // Sort tasks within each list
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.values(listMap).forEach((list) => {
    list.tasks.sort((a, b) => (a.attributes.position || 0) - (b.attributes.position || 0));
  });

  // Convert the map back to an array and sort lists
  return Object.values(listMap).sort((a, b) => (a.position || 0) - (b.position || 0));
}
