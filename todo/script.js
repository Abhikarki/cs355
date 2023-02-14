
    const form = document.querySelector('#todoForm')
    const input = document.querySelector('#typeTodo')
    const mainDiv = document.querySelector(".main")

    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        const item = input.value;
        
        input.value = "";

        if(!item){
            console.log("Pleas type a task first");
            return;
        }

        const taskItem = document.createElement("div");
        taskItem.classList.add("task");

        taskItem1 = document.createElement("div");
        taskItem1.classList.add("textDiv");
        taskItem1.innerText = item;


        const completeButton = document.createElement("button");
        completeButton.classList.add("completed");
        completeButton.addEventListener("click", function(){
            const curr = this.style.backgroundColor;
            if(curr == "green"){
                this.style.backgroundColor = "red";
                this.innerText = "pending";
            }
            else{
                this.style.backgroundColor = "green";
                this.innerText = "completed";
            }
        })
        completeButton.innerText = "pending";
        
        taskItem.appendChild(taskItem1);
        taskItem.appendChild(completeButton);
        
        mainDiv.appendChild(taskItem);

    })

    
