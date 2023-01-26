import React from "react";
import { useState, useEffect } from "react";
import { RiMenuAddFill } from "react-icons/ri";
import { TfiClose } from "react-icons/tfi";

const API_BASE = "https://mernbackend-w54e.onrender.com";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupactive, setpopupactive] = useState(false);
  const [newTodo, setNewtodo] = useState("");

  useEffect(() => {
    GetTodos();
    // console.log(todos);
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error(err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }
        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data._id));
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ text: newTodo }),
    }).then((res) => res.json());
    setTodos([...todos, data]);
    setpopupactive(false);
    setNewtodo("");
  };

  return (
    <>
      <div className="App">
        <h1>Welcome</h1>
        <h4>Your Task</h4>

        <div className="todos">
          {todos.map((todo) => (
            <div
              className={"todo " + (todo.complete ? "is-complete" : "")}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"> </div>
              <div className="text">{todo.text}</div>
              <div
                className="delete-todo"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo._id);
                }}
              >
                <TfiClose />
              </div>
            </div>
          ))}
        </div>
        <div className="addPopup" onClick={() => setpopupactive(true)}>
          <RiMenuAddFill />
        </div>
        {popupactive ? (
          <div className="popup">
            <div className="closepopup" onClick={() => setpopupactive(false)}>
              <TfiClose />
            </div>
            <div className="contaent">
              <h3>Add Task</h3>
              <input
                type="text"
                className="add-todo-input"
                onChange={(e) => setNewtodo(e.target.value)}
                value={newTodo}
              />
              <div className="button" onClick={addTodo}>
                Create Task
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default App;
