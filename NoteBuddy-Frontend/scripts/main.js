// function showMessage() {
//   alert("Hallo FrontBuddy");
// }
// document.addEventListener("DOMContentLoaded", showMessage);
//
// function showMessage2() {
//   console.log("Hallo Entwicklerwelt");
// }
//
// document.addEventListener("DOMContentLoaded", showMessage2);

// Hier können später Funktionen für die Interaktivität hinzugefügt werden
document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.querySelector(".todo-list");
  const todoItems = document.querySelectorAll(".todo-item");

  todoItems.forEach((item) => {
    // Macht das Element draggable
    item.draggable = true;

    item.addEventListener("dragstart", function (e) {
      e.target.classList.add("dragging");
    });

    item.addEventListener("dragend", function (e) {
      e.target.classList.remove("dragging");
    });

    item.addEventListener("dragover", function (e) {
      e.preventDefault();
      const draggingItem = document.querySelector(".dragging");
      const notDraggingItems = [
        ...todoList.querySelectorAll(".todo-item:not(.dragging)"),
      ];

      // Findet das nächstgelegene Element
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
    });
  });
});

