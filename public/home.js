// home.js file
window.onclick = handleClick;
let container = document.getElementsByClassName("container")[0];

function handleClick(event){
    console.log("I am home");
    let clickedElement = event.target;

    // dashboard
    // if(clickedElement.id=="dashboard"){
    //     axios.get('/dashboard')
    //         .then(res=>{
    //             console.log(res);
    //             console.log("res: ",res.data.status);
    //             console.log("res.status: ",res.status, " res.data.status: ",res.data.status);
    //             if(res.data.status!=200){
    //                 console.log("I am wrong res");
    //                 let errorMessage = document.createElement('h2');
    //                 errorMessage.innerHTML = res.data.message;
    //                 errorMessage.style.color = "red",
    //                 container.appendChild(errorMessage);
    //                 let errorReqst = document.createElement('h3');
    //                 errorReqst.innerHTML = res.data.request;
    //                 errorReqst.style.color = "red";
    //                 container.appendChild(errorReqst);
    //             }else if (res.data.status==200){

    //                 // document.body.innerHTML = res.data;
    //                 window.location.href = res.data.url;
    //                 console.log(res.data.url);
    //             }
    //         })
    //         .catch(err=>{
    //             console.log(err);
    //         })
    // }

    // register
     if (clickedElement.id == "register") {
        axios.get('/register')
            .then(res => {
                console.log("Registration form is loaded successfully");
                // document.body.innerHTML = res.data;
                window.location.href = "/register"
            })
            .catch(err => {
                console.error("Error loading registration form:", err);
            });
        }

    // login
    else if(clickedElement.id == "login"){
        axios.get('/login')
        .then(res => {
            console.log("Login form is loaded successfully");
            window.location.href = "/login"
        })
        .catch(err => {
            console.error("Error in loading login form: ", JSON.stringify(err));
        });   
    }
}