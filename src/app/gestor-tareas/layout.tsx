import { Metadata } from "next";
import Header from "@/components/organisms/header";
import { SideBar } from "@/components/molecules/SideBar/SideBar";
import TaskManager from "./page";

export const metadata: Metadata = {
  title: "Task manager",
  description: "Gestor de tareas"
};
const TaskManagerLayout = () => {
  return (
    <div className="page">
      <SideBar />
      <div className="mainContent">
        <Header title="Gestor de tareas" />
        <TaskManager />
      </div>
    </div>
  );
};
export default TaskManagerLayout;
