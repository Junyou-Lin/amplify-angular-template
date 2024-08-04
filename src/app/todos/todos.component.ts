import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: any[] = [];

  ngOnInit(): void {
    this.listTodos();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    try {
      const content = window.prompt('Todo content');
      if (content) {
        client.models.Todo.create({
          content: content,
          isDone: false,
        });
        this.listTodos();
      }
    } catch (error) {
      console.error('error creating todo', error);
    }
  }

  toggleTodoDone(todo: any) {
    try {
      client.models.Todo.update({
        id: todo.id,
        isDone: !todo.isDone,
      });
      this.listTodos();
    } catch (error) {
      console.error('error updating todo', error);
    }
  }

  deleteTodo(id: string) {
    try {
      client.models.Todo.delete({ id });
      this.listTodos();
    } catch (error) {
      console.error('error deleting todo', error);
    }
  }

  sayHello() {
    try {
      const name = window.prompt('Your name');
      if (name) {
        client.queries.sayHello({ name }).then((response) => {
          alert(response.data);
        });
      }
    } catch (error) {
      console.error('error saying hello', error);
    }
  }
}
