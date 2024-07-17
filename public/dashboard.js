window.onload = displayTodos;
window.onclick = handleClick;
let todoContainer = document.getElementsByClassName('todos')[0];
let todoList = document.getElementById('todoList');

let skip = 0;

function displayTodos() {
    axios.get(`/read-todo?skip=${skip}`)
        .then(res => {
            if (res.status !== 200) {
                let errorMessage = document.createElement('h2');
                errorMessage.innerHTML = res.data.message;
                todoContainer.appendChild(errorMessage);
            } else {
                let todos = res.data.todo;
                if (todos.length > 0) {
                    skip += todos.length; // increment skip by the number of todos received
                }else if (todos.length<=0 && skip>0){
                    alert('No more Todos Found');
                }else if (todos.length<=0 && skip<=0){
                    alert('No Todo Found, Please first create them');
                }
                todos.map((todo) => {
                    let eachList = document.createElement('li');
                    let spanInLi = document.createElement('span');
                    spanInLi.className = "span-li";
                    eachList.appendChild(spanInLi);
                    spanInLi.innerHTML = todo.task;

                    let btnDiv = document.createElement('div');

                    let deleteBtn = document.createElement('button');
                    deleteBtn.innerText = "Delete";
                    deleteBtn.className = "dltBtn";
                    deleteBtn.setAttribute("data-id", todo._id);
                    btnDiv.appendChild(deleteBtn);

                    let editBtn = document.createElement('button');
                    editBtn.innerText = "Edit";
                    editBtn.className = "editBtn";
                    editBtn.setAttribute("data-id", todo._id);
                    btnDiv.appendChild(editBtn);

                    eachList.appendChild(btnDiv);

                    todoList.append(eachList);
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
}

function handleClick (event){
    let clickedElement = event.target;
    let todoID = clickedElement.getAttribute('data-id');

    // edit
    if(clickedElement.className=="editBtn"){
        let newData = prompt('Enter new data');

        axios.post('/update-todo',{newData,todoID})
            .then(res=>{
                if(res.status!=200){
                    let newError = document.createElement('h2');
                    newError.style.color = "red";
                    newError.innerHTML = res.message;
                    todoContainer.appendChild(newError);
                    return;
                }else{
                    clickedElement.parentElement.parentElement.querySelector('.span-li').innerText=newData;
                    return;
                }
            })
            .catch(err=>{
                console.log(err);

            })
    }

    // delete
    else if(clickedElement.className=="dltBtn"){
        axios.post('/delete-todo',{todoID})
            .then(res=>{
                if(res.status!=200){
                    console.log(res.message);
                    return;
                }
                clickedElement.parentElement.parentElement.remove();
            })
            .catch(err=>{
                console.log(err);
            })
            
    }

    // create
    else if(clickedElement.className=="create"){
        event.preventDefault();
        let todoInput = document.getElementById('todo-input');
        let todo = todoInput.value;
        if(!todo){
            alert("Please enter  some text");
            return;
        }
        axios.post('/create-todo',{todo})
            .then(res=>{
                let eachList = document.createElement('li');
                let spanInLi = document.createElement('span');
                spanInLi.className = "span-li";
                eachList.appendChild(spanInLi);
                spanInLi.innerHTML = todo;

                let btnDiv = document.createElement('div');

                let deleteBtn = document.createElement('button');
                deleteBtn.innerText = "Delete";
                deleteBtn.className = "dltBtn";
                btnDiv.appendChild(deleteBtn);

                let editBtn = document.createElement('button');
                editBtn.innerText = "Edit";
                editBtn.className = "editBtn";
                btnDiv.appendChild(editBtn);

                eachList.appendChild(btnDiv);

                todoList.append(eachList);

                todoInput.value="";
                
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // logout
    else if(clickedElement.id == "logout"){
        axios.post('/logout')
            .then(res=>{
                if(res.status==200){
                    window.location.href = '/login';
                }else {
                    console.error("Logout failed:", res.data.message);
                    alert("Logout failed: " + res.data.message);
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // delete account
    else if(clickedElement.id == "deleteAccount"){
        axios.post('/deleteAccnt')
            .then(res=>{
                if(res.status==200){
                    window.location.href = '/register';
                }else {
                    console.error("Deleting failed:", res.data.message);
                    alert("Deleting failed: " + res.data.message);
                }
            })
            .catch(err=>{
                console.log(err);
            })
    }

    // home
    else if(clickedElement.id=="home"){
        window.location.href = '/'
    }


    // show more
    else if(clickedElement.id=="showMore"){
        displayTodos();
    }
}