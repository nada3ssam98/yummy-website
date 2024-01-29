let rowData = document.getElementById('rowData')
let searchContainer = document.getElementById("searchContainer");
let submitBtn = document.getElementById('submit')
searchByName("")
$(".outer-spinner-screen").fadeOut(500)

function navSwap(){
    
    if ($(".side-nav").css("left") == "0px") {
        let totalWidth = $(".side-nav .navTab").outerWidth()
       
        $(".side-nav").animate({left: -totalWidth}, 1000 )
        
        for (let i = 0; i < 5; i++) {
            $(".seachUL li").eq(i).animate({top: '30px'}, 300)
        }
    }
    
        
    else {
        $(".side-nav").animate({left: 0}, 1000,function(){
            for (let i = 0; i < 5; i++) {
                $(".seachUL li").eq(i).animate({top: '0'}, 300)
            }
        })
    

    }
}
async function getCategories(){
    searchContainer.innerHTML=""
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
     let respone = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
     respone = await respone.json()
     let arr = respone.categories
     displayCategories(arr)
     $(".spinner-screen").fadeOut(300)

}
function displayCategories(arr){

     let cartona=""
     for(let i=0;i<arr.length;i++){
        cartona+=`
        <div class="col-md-3">
        <div class="meal position-relative  overflow-hidden rounded-2 " onclick="getCategoryMeals('${arr[i].strCategory}')" >
            <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" >
            <div class="mealLayer position-absolute text-center p-2">
                <h3>${arr[i].strCategory}</h3>
                <p>${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
    </div>`
     }
     rowData.innerHTML = cartona
}

async function getCategoryMeals(category){
    $(".spinner-screen").fadeIn(300)
    category = category.toLowerCase()
    rowData.innerHTML = ""

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    
    
}

function displayMeals(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer" onclick="getMealDetails('${arr[i].idMeal}')">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="mealLayer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}

async function getMealDetails(mealID){
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
}

async function getIngredients(){
    searchContainer.innerHTML=""
    $(".spinner-screen").fadeIn(300)
        rowData.innerHTML = ""
        
        let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        respone = await respone.json()
        console.log(respone.meals);
    
        displayIngredients(respone.meals.slice(0, 20))    
        $(".spinner-screen").fadeOut(300)

    
}

function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3 text-light">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartoona
}

async function getIngredientsMeals(ingredients) {
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))

}

async function getMealDetails(mealID) {
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])

}

function displayMealDetails(meal) {

    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let cartoona = `
            <div class="col-md-4 text-light">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8 text-light">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = cartoona
}

async function getArea(){
    searchContainer.innerHTML=""
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    response = await response.json()
    let arr = response
    console.log(response.meals);
    displayArea(arr.meals)
    $(".spinner-screen").fadeOut(300)

}


function displayArea(arr){
    let cartona=""
    for(let i=0;i<arr.length;i++){
       cartona+=`
       <div class="col-md-3 text-light">
       <div class="text-center rounded-2" onclick="getAreaMeals('${arr[i].strArea}') ">
            <i class="fa-solid fa-house-laptop fa-4x cursor-pointer"></i>
            <h3>${arr[i].strArea}</h3>
       </div>
   </div>`
    }
     rowData.innerHTML = cartona
}

 async function getAreaMeals (area){
    searchContainer.innerHTML=""
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()
    displayMeals(response.meals.slice(0, 20))
    $(".spinner-screen").fadeOut(300)


 }

function allValidation(){
    if (nameInputValidation() && emailInputValidation() && phoneInputValidation() && ageInputValidation() && passwordInputValidation() && matchPasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}
function nameInputValidation(){
    let nameInput = document.getElementById("nameInput")
    nameInput = nameInput.value
    let pattern =/^[a-zA-Z ]+$/
    if(pattern.test(nameInput)){
        // document.getElementById('nameInputAlert').classList.replace("d-block","d-none")
        console.log("TRUE");

    }
    else{
        document.getElementById('nameInputAlert').classList.replace('d-none','d-block')

    }
    
}
function emailInputValidation(){
    let emailInput = document.getElementById("emailInput").value

    let pattern =/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if(pattern.test(emailInput)){
        document.getElementById('emailInputAlert').classList.replace('d-block','d-none')
    }
    else{
        document.getElementById('emailInputAlert').classList.replace('d-none','d-block')

    }
    
}
function phoneInputValidation(){
    let phoneInput = document.getElementById("phoneInput").value
    let pattern =/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if(pattern.test(phoneInput)){
        document.getElementById('phonInputAlert').classList.replace('d-block','d-none')
    }
    else{
        document.getElementById('phoneInputAlert').classList.replace('d-none','d-block')

    }
}
function ageInputValidation(){
    let ageInput = document.getElementById("ageInput").value
    let pattern = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/
    if(pattern.test(ageInput)){
        document.getElementById('ageInputAlert').classList.replace('d-block','d-none')
    }
    else{
        document.getElementById('ageInputAlert').classList.replace('d-none','d-block')

    }
}
function passwordInputValidation(){
    let passwordInput = document.getElementById("passwordInput").value
    let pattern =/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/
    if(pattern.test(passwordInput)){
        document.getElementById('passwordInputAlert').classList.replace('d-block','d-none')
    }
    else{
        document.getElementById('passwordInputAlert').classList.replace('d-none','d-block')

    }
}
function matchPassInputValidation(){
    let matchPasswordInput = document.getElementById("machPasswordInput").value
    if(matchPasswordInput == document.getElementById("passwordInput").value){
        return true
    }
    else{
        return false

    }
}
function contactUs(){
    rowData.innerHTML = `            <div class="conntactUs d-flex justify-content-center align-items-center min-vh-100">
    <div class="container text-center w-75 ">
        <div class="row">
            <div class="col-md-6 p-3">                    
                <input type="text" class="form-control " placeholder="Enter your name" onkeyup="nameInputValidation()" id="nameInput">
                <div class="alert alert-danger w-100 d-none" id="nameInputAlert">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6 p-3">                    
                <input type="email" class="form-control  " placeholder="Enter your email" onkeyup="emailInputValidation()" id="emailInput">
                <div class="alert alert-danger w-100 d-none" id="emailInputAlert">                    
                    Email not valid *exemple@yyy.zzz
                </div>

            </div>
            <div class="col-md-6 p-3">                    
                <input type="number" class="form-control  " placeholder="Enter your phone" onkeyup="phoneInputValidation()" id="phoneInput">
                <div class="alert alert-danger w-100 d-none" id="phoneInputAlert">
                    Enter valid Phone Number
                </div>

            </div>
            <div class="col-md-6 p-3">                    
                <input type="number" class="form-control " placeholder="Enter your age" onkeyup="ageInputValidation()" id="ageInput">
                <div class="alert alert-danger w-100 d-none" id="ageInputAlert">
                    age must be a number
                </div>

            </div>
            <div class="col-md-6 p-3">                    
                <input type="password" class="form-control " placeholder="Enter your password" onkeyup="passwordInputValidation()" id="passwordInput">
                <div class="alert alert-danger w-100 d-none" id="passwordInputAlert">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*

                </div>

            </div>
            <div class="col-md-6 p-3">                    
                <input type="password" class="form-control " placeholder="Retype your password" onkeyup="matchPassInputValidation()" id="machPasswordInput">
                <div class="alert alert-danger w-100 d-none" id="repasswordInputAlert">
                    password should match
                </div>

            </div>
        </div>
        <button id="submit" disabled="true" class="btn btn-danger px-2 mt-3" onclick="allValidation()">Submit</button>

    </div>
</div>`
}

function showSearchContainer() {
    searchContainer.innerHTML = `
    <div class="row">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="search by name" id="byNameSearch">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text"  placeholder="search by first letter" id="firstLetterSearch">
        </div>
    </div>`
    
    rowData.innerHTML = ""
}


 
async function searchByName(name){
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    response = await response.json()
    if(response.meals) {displayMeals(response.meals)}
        else {displayMeals([])} 
    $(".spinner-screen").fadeOut(300)
}


async function searchByFirstLetter(letter){
    $(".spinner-screen").fadeIn(300)
    rowData.innerHTML = ""
    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    response = await response.json()
    if(response.meals)  {displayMeals(response.meals) }
    else {displayMeals([])}
    $(".spinner-screen").fadeOut(300)

}