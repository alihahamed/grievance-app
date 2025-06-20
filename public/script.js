// pop-up after submitting complaint
const popup = document.querySelector(".boxContainer")
const close_popup = document.querySelector(".container")
const test = document.getElementById("test")

function openBox(){
    popup.classList.add('open')
    close_popup.classList.add('close')
}
function closeBox(){
    popup.classList.remove('open')
    close_popup.classList.remove('close')
}





// login
 
if(document.getElementById('loginForm')){
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault()

        const username = document.getElementById('username').value
        const password = document.getElementById('user-password').value
        
        
        const response = await fetch('/auth/login', {
            method: 'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username, password})
            
        })
        const data = await response.json()

        if(data.success){
            currentUser = {
                role:data.role,
                userId:data.userId,
                username:data.username
            }
        }
        localStorage.setItem('currentUser',JSON.stringify(currentUser))

        setTimeout(() => {
                if(data.role === 'admin'){
                    window.location.href =  '/complaints'
                }
                else {
                    window.location.href =  '/dashboard'
                }
                    
        },1000)
    }
)
}

// complaint submission

if(document.getElementById('dashboard-form')){
   

    const storedUser = localStorage.getItem('currentUser')
    if(storedUser){
        currentUser = JSON.parse(storedUser)
    }
    else{
        window.location.replace("/index")
        }


    document.getElementById('dashboard-form').addEventListener('submit', async (e) => {
        e.preventDefault()

        const title = document.getElementById('title').value
        const description = document.getElementById('description').value

        const response = await fetch('/auth/dashboard', {
             method:'post',
             headers:{
                'Content-Type':'application/json'
             },
             body:JSON.stringify({
                userId:currentUser.userId,
                title:title,
                description:description
             })
        })  
           const data = await response.json()
           
           if(data.success){
                document.getElementById('title').textContent = ''
                document.getElementById('description').textContent = ''
           }
    })
} 

// get complaints 

async function loadComplaints(){
    const res = await fetch('/auth/dashboard')
    const data =  await res.json()

    if(data.success){
        displayComplaints(data.complaints)
    }
    else{
        console.log("Cannot load complaints")
    }
}

 

function displayComplaints(complaints){
    
    const complaintsNumber = document.getElementById("complaints-number")
    const complaintsDiv = document.getElementById("complaintsDiv")

   
    complaintsNumber.textContent = complaints.length
    complaintsDiv.textContent = ''
    
    complaints.forEach(complaint => {
        const complaintElem = document.createElement('div')
        complaintElem.classList.add('complaint-item')
        complaintElem.innerHTML = `
            <div id = "complaint-title">${complaint.title}</div>
            <div id = "complaint-meta">
            <span>${complaint.username}</span>
            <span id = "complaint-time">${new Date(complaint.created_at).toLocaleTimeString()}</span>
            <span id = "complaint-date">${new Date(complaint.created_at).toLocaleDateString()}</span>
            </div>
            <div id = "complaint-description">
                <p>${complaint.description}</p><span id="delete"><button class = "deleteBtn" data-id = "${complaint.id}"><i class="fa-solid fa-trash"></i></button></span>
                </div>
        `
        complaintsDiv.appendChild(complaintElem)
    });

    // delete complaint

    document.querySelectorAll(".deleteBtn").forEach(btn => {
        btn.addEventListener('click' ,async function() {
            const id = this.getAttribute("data-id")
            const res = await fetch(`/auth/dashboard/${id}`, {
                method:'delete'
            })
            const data =  await res.json()
            if(data.success){
                loadComplaints()
            }
            else{
                console.log("idk")
            }
        })  
    })
} 

// logout function 

function logout(){
    localStorage.removeItem('currentUser')
    window.location.replace("/login")
}

// no access to admin page

if(window.location.href.includes("http://localhost:3002/complaints")){
    storedUser = localStorage.getItem('currentUser')
    if(storedUser){
        currentUser = JSON.parse(storedUser)
    }
    if(currentUser.role !== 'admin'){
        window.location.replace("/dashboard")
    }

        
}   


// welcome page

if(window.location.href.includes("/index")){
    const indexName = document.getElementById("index-name")
    let name = localStorage.getItem("asna-name")
    if(!name){
        name = prompt("What is your beautiful name?")
        if(name){
            localStorage.setItem("asna-name", name)
        }
    }
    if(name){
        indexName.textContent = name
    }
}

