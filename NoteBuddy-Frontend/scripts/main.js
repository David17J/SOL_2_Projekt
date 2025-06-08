function addDragAndDropListeners() {
  const todoList = document.querySelector(".todo-list");
  const todoItems = todoList.querySelectorAll(".todo-item");

  todoItems.forEach((item) => {
    item.draggable = true;

    // Verhindere, dass die Events mehrfach hinzugefügt werden
    item.removeEventListener("dragstart", dragStartHandler);
    item.removeEventListener("dragend", dragEndHandler);
    item.removeEventListener("dragover", dragOverHandler);

    item.addEventListener("dragstart", dragStartHandler);
    item.addEventListener("dragend", dragEndHandler);
    item.addEventListener("dragover", dragOverHandler);
  });

  function dragStartHandler(e) {
    e.target.classList.add("dragging");
  }

  function dragEndHandler(e) {
    e.target.classList.remove("dragging");
  }

  function dragOverHandler(e) {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const notDraggingItems = [
      ...todoList.querySelectorAll(".todo-item:not(.dragging)"),
    ];

    const nextItem = notDraggingItems.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;

    if (nextItem) {
      todoList.insertBefore(draggingItem, nextItem);
    } else {
      todoList.appendChild(draggingItem);
    }
  }
}

// Beim Laden erstmal Eventlistener für alle vorhandenen Items setzen
document.addEventListener("DOMContentLoaded", function () {
  addDragAndDropListeners();
});
