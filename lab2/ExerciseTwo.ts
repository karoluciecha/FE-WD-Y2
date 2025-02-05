// Defines an interface that acts as a blueprint for any class implementing it
interface TaskManager {
    // An array of strings to store tasks
    tasks: string[];
    // A method that adds a task and returns the updated task count
    addTask(task: string): number;
    // A method to print all tasks, returns nothing
    listAllTasks(): void;
    // A method that removes a task and returns the updated count
    deleteTask(task: string): number;
}

// Implements the TaskManager interface, ensuring that all required methods are defined
class TaskList implements TaskManager {
    // Defines tasks as an empty array of strings
    tasks: string[] = [];

    // Function accepts a task string as input and returns current array length
    addTask(task: string): number {
        // Adds the task to the tasks array using .push() and calculates the length
        let length : number = this.tasks.push(task);

        // Printing a message to the console indicating insertion
        console.log(`Task "${task}" added to the list.\n`);

        // Returns current length of the array
        return length;
    }

    // Declaring listAllTasks function
    // Function does not return anything
    listAllTasks(): void {
        console.log("Tasks:");

        // Iterating over each task in the tasks array and printing each item to the console
        this.tasks.forEach(task => console.log(task));
        console.log(``);
    }

    // Function accepts a task string as input and returns current array length
    deleteTask(task: string): number {
        // If the string task is found in the tasks array indexOf() returns its index
        // If not found function returns -1
        const index = this.tasks.indexOf(task);
        if (index > -1) {
            // Removes the task from the array by removing its index
            // deleteCount is set to 1 to remove only the first instance of the task
            this.tasks.splice(index, 1);
            // Printing a message to the console indicating deletion
            console.log(`Task "${task}" removed from the list.\n`);
        } else {
            console.log(`Task "${task}" not found.\n`);
        }
        // Returning the number of elements in the array after the deletion
        return this.tasks.length;
    }
}

// Testing
const myTasks = new TaskList();
myTasks.addTask("Do groceries");
myTasks.addTask("Dust the furniture");
myTasks.listAllTasks();
myTasks.deleteTask("Do groceries");
myTasks.deleteTask("Go to work")
myTasks.listAllTasks();