const db = firebase.firestore()
let tasks = []
let currentUser = {}

function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser.uid = user.uid
      readTasks()
      let userLabel = document.getElementById("navbarDropdown")
      userLabel.innerHTML = user.email
    } else {
      swal
        .fire({
          icon: "success",
          title: "Redirecionando para a tela de autenticação",
        })
        .then(() => {
          setTimeout(() => {
            window.location.replace("Login.html")
          }, 1000)
        })
    }
  })
}

function createDelButton(task) {
  const newButton = document.createElement("button")
  newButton.setAttribute("class", "btn btn-secondary")
  newButton.appendChild(document.createTextNode("Excluir"))
  newButton.setAttribute("onclick", `deleteTask("${task.id}")`)
  return newButton
}

function renderTasks() {
  let itemList = document.getElementById("itemList")
  itemList.innerHTML = ""
  for (let task of tasks) {
    const newItem = document.createElement("li")
    newItem.setAttribute(
      "class",
      "list-group-item d-flex justify-content-between",
    )
    newItem.appendChild(document.createTextNode(task.title))
    newItem.appendChild(createDelButton(task))
    itemList.appendChild(newItem)
  }
}

async function readTasks() {
  tasks = []
  const logTasks = await db
    .collection("tasks")
    .where("owner", "==", currentUser.uid)
    .get()
  for (doc of logTasks.docs) {
    tasks.push({
      id: doc.id,
      title: doc.data().title,
    })
  }
  renderTasks()
}

async function addTask() {
  const itemList = document.getElementById("itemList")
  const newItem = document.createElement("li")
  newItem.setAttribute("class", "list-group-item")
  newItem.appendChild(document.createTextNode("Adicionando na nuvem..."))
  itemList.appendChild(newItem)

  const title = document.getElementById("newItem").value
  await db.collection("tasks").add({
    title: title,
    owner: currentUser.uid,
  })
  readTasks()
}

async function deleteTask(id) {
  await db.collection("tasks").doc(id).delete()
  readTasks()
}

window.onload = function () {
  getUser()
}


var hh = 0;
var mm = 0;
var ss = 0;

var tempo = 1000;//Quantos milésimos valem 1 segundo?
var cron;

//Inicia o temporizador
function start() {
    cron = setInterval(() => { timer(); }, tempo);
}

//Para o temporizador mas não limpa as variáveis
function pause() {
    clearInterval(cron);
}

//Para o temporizador e limpa as variáveis
function stop() {
    clearInterval(cron);
    hh = 0;
    mm = 0;
    ss = 0;

    document.getElementById('counter').innerText = '00:00:00';
}

//Faz a contagem do tempo e exibição
function timer() {
    ss++; //Incrementa +1 na variável ss

    if (ss == 59) { //Verifica se deu 59 segundos
        ss = 0; //Volta os segundos para 0
        mm++; //Adiciona +1 na variável mm

        if (mm == 59) { //Verifica se deu 59 minutos
            mm = 0;//Volta os minutos para 0
            hh++;//Adiciona +1 na variável hora
        }
    }

    //Cria uma variável com o valor tratado HH:MM:SS
    var format = (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm) + ':' + (ss < 10 ? '0' + ss : ss);
    
    //Insere o valor tratado no elemento counter
    document.getElementById('counter').innerText = format;

    //Retorna o valor tratado
    return format;
}