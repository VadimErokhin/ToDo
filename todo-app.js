(function () {
  function createAppTitle(title) {
      let appTitle = document.createElement('h2')
      appTitle.innerHTML = title;
      return appTitle;
  }

  function createTodoItemForm() {

      let form = document.createElement('form');
      let input = document.createElement('input');
      let buttonWrapper = document.createElement('div');
      let button = document.createElement('button');
      const onInput = function({target}) {
        if(target.value) {
            button.removeAttribute('disabled')
        } else {
            button.setAttribute('disabled', '')
        }
    }

      form.classList.add('input-group', 'mb-3');
      input.classList.add('form-control');
      input.addEventListener('input', onInput);
      input.placeholder = 'Введите название нового дела';
      button.classList.add('btn', 'btn-primary');
      button.textContent = 'Добавить дело';
      button.setAttribute('disabled', '')

      buttonWrapper. append(button);
      form.append(input);
      form.append(buttonWrapper);

      return {
          form,
          input,
          button,
      };
  }

  function createTodoList () {
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list;
  }

  function createTodoItem(todoData, key, saveToLS, onDoneClb) {
      console.log('tododata', todoData)
      let storeItems = getTodosFromStorage(key) || [];
      let item = document.createElement('li');
      let buttonGroup = document.createElement('div');
      let doneButton = document.createElement('button');
      let deleteButton = document.createElement('button');


      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-cnter');
      item.textContent = todoData.name;

      buttonGroup.classList.add('btn-group', 'btn-group-sm');
      doneButton.classList.add('btn', 'btn-success');
      doneButton.textContent = 'Готово';
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Удалить';

      if(todoData.done) {
        toggleItemActive(item, key, false, todoData, onDoneClb)
      }


      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);


      doneButton.addEventListener('click', (e) => {
        toggleItemActive(item, key, true, todoData, onDoneClb)
      })


      deleteButton.addEventListener('click', () =>  deleteItem(todoData, key, item));
      // if(storeItems.findIndex(i => i.name === todoData.name) === -1) {
        if(saveToLS) {
          storeItems.push({...todoData, index: storeItems.length})
          localStorage.setItem(key, JSON.stringify(storeItems));
        }
        // }


      return {
          item,
          doneButton,
          deleteButton,
      };


  }

  function toggleItemActive(item, key, saveToLS, todoData, onDoneClb) {
    item.classList.toggle('list-group-item-success');
    onDoneClb(item);
    console.log("toggleitemactive", saveToLS, todoData)
    if(saveToLS) {
      const storeItems = getTodosFromStorage(key) || [];
      console.log('storeitems', storeItems)
      const newItems = storeItems.map(i => {
        if(todoData.index === i.index) {
          return {
            ...i, done: !i.done
          }
        }else {
          return i
        }
      })
      console.log('newitems', newItems)
      localStorage.setItem(key, JSON.stringify(newItems));
    }

  };


  function deleteItem(todoData, key, item) {
    const storeItems = getTodosFromStorage(key) || [];
    if (confirm('Вы уверены?')) {
      item.remove();
      // const delIndex = storeItems.findIndex(i => todoData.name === i.name);
      const newItems = storeItems.filter(i => i.index !== todoData.index)
      localStorage.setItem(
        key,
        JSON.stringify(
          newItems.map((i, index) => ({
            ...i, index
         }))
        )
      )
    }

  }

  function getTodosFromStorage(key) {
    const storeItems = localStorage.getItem(key);
    let formatedItems;
    if(storeItems) {
      formatedItems = JSON.parse(storeItems);
    }

    return formatedItems;
  }

  function createTodoApp(container, title = "Список дел", defaultItems = [{name: 'Сходить за хлебом', done: false}]) {
    const key = title.toLowerCase().replace(' ', '');
    const itemsFromStorage = getTodosFromStorage(key);

    const formatedItems = itemsFromStorage || defaultItems.map((i, index) => ({...i, index}));
    console.log('TodoAPP', getTodosFromStorage(key), formatedItems);
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    // let todoItems = [createTodoItem('Сходить за хлебом', onDoneItem), createTodoItem('Купить молоко', onDoneItem)];
    let todoItems = formatedItems.map(item => {
      console.log('createtodo', item)
      return createTodoItem(item, key, !Boolean(itemsFromStorage), onDoneItem)
    })


    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    todoItems.forEach(i => todoList.append(i.item))
    todoItemForm.form.addEventListener('submit', function(e) {
        e.preventDefault();

        if(!todoItemForm.input.value) {
            return;
        }
        const storeItems = getTodosFromStorage(key)
        const todoItem = createTodoItem({name: todoItemForm.input.value, done: false, index: storeItems.length}, key, true, onDoneItem);

        todoList.append(todoItem.item);

    });

    function onDoneItem(item) {
      todoItemForm.input.value = '';
    }



  }

  window.createTodoApp = createTodoApp;









})();
