import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  fetchSpecialistTasks,
  selectSpecialistTasks,
  selectTasksLoading,
  selectTasksError
} from "shared/store/slices/tasksSpecialistSlice";
import styles from "./Tasks.module.scss";
import { TaskSpecialist } from "shared/store/slices/tasksSpecialistSlice";

const statusTitles: { [key: string]: string } = {
  to_do: "Нужно выполнить",
  in_progress: "В процессе",
  done: "Выполнено",
  failed: "Провалено",
  frozen: "Заморожено",
};

const getStatusLabel = (status: string) => {
  return statusTitles[status] || "Неизвестный статус";
};

const TaskTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectSpecialistTasks);
  const loading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);

  useEffect(() => {
    dispatch(fetchSpecialistTasks());
  }, [dispatch]);

  const groupedTasks = tasks.reduce<{ [key: string]: typeof tasks }>((acc, task) => {
    const statusTitle = getStatusLabel(task.status);
    if (!acc[statusTitle]) {
      acc[statusTitle] = [];
    }
    acc[statusTitle].push(task);
    return acc;
  }, {});

  return (
      <div className={styles.container}>
        <div className={styles.taskHeader}>
          <p>Мои задачи</p>
        </div>

        {loading && <p style={{ color: "white" }}>Загрузка задач...</p>}

        {!loading && !error && (
            <div className={styles.table}>
              <div className={styles.header}>
                <div className={styles.headerCell}>Название задачи</div>
                <div className={styles.headerCell}>Исполнитель</div>
                <div className={styles.headerCell}>Статус</div>
                <div className={styles.headerCell}>Проект</div>
                <div className={styles.headerCell}>Дедлайн</div>
              </div>

              {Object.entries(groupedTasks).map(([status, group]) => (
                  <div key={`group-${status}`} className={styles.taskGroup}>
                    {group.map((task) => (
                        <div key={`task-${task.id}`} className={styles.row}>
                          <div className={styles.cell}>
                            <div className={styles.taskCell}>
                              {task.title}
                              <button className={styles.taskButton}>Перейти к задаче</button>
                            </div>
                          </div>
                          <div className={styles.cell}>
                            {task.assigned_specialist?.join(", ") || "Не назначен"}
                          </div>
                          <div className={styles.cell}>{getStatusLabel(task.status)}</div>
                          <div className={styles.cell}>Проект {task.project || "–"}</div>
                          <div className={styles.cell}>
                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : "–"}
                          </div>
                        </div>
                    ))}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default TaskTable;
