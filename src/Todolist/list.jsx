import { useEffect, useState } from "react";
import { axiosInstance } from "../config/axios.config.js";
const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [tasktitle, setTaskTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    setTaskTitle((s) => e.target.value);
  };
  const getTodos = async (search) => {
    const response = await axiosInstance.get("/todos", {
      params: { q: search },
    });
    setTodos(response.data);
  };

  const handleDelete = (id) => {
    axiosInstance.delete(`/todos/${id}`).then(() => getTodos());
  };

  const handleSearch = (e) => {
    setSearchValue((s) => e.target.value);
  };
  const handleEdit = ({ title, completed, id }) => {
    axiosInstance
      .patch(`/todos/${id}`, { completed: false })
      .then(() => getTodos());
  };
  const handleDone = ({ title, completed, id }) => {
    axiosInstance
      .patch(`/todos/${id}`, { completed: true })
      .then(() => getTodos());
  };

  const addTask = async (e) => {
    e.preventDefault();
    axiosInstance
      .post("/todos", {
        title: tasktitle,
        completed: false,
      })
      .then((data) => getTodos());
  };

  useEffect(() => {
    const timer = setTimeout(() => getTodos(searchValue), 3000);
    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Search ex: todo 1"
          onChange={(e) => handleSearch(e)}
          value={searchValue}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          value={tasktitle}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div key={id} className={`list ${todo.completed ? "completed" : ""}`}>
            <p> {todo.title}</p>
            <div className="span-btns">
              {!todo.completed && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
