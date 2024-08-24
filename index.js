let myLeads = []
let editIndex = null  // Track the index of the lead being edited
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const updateBtn = document.getElementById("update-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn = document.getElementById("tab-btn")
const categoryEl = document.getElementById("category")

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url
        if (url.trim() !== "") {
            const timestamp = new Date().toLocaleString()
            myLeads.push({ url, timestamp, category: '' })
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
        }
    })
})

function render(leads) {
    const selectedCategory = categoryEl.value
    let listItems = ""

    for (let i = 0; i < leads.length; i++) {
        if (selectedCategory === '' || leads[i].category === selectedCategory) {
            listItems += `
                <li>
                    <a target='_blank' href='${leads[i].url}'>
                        ${leads[i].url}
                    </a>
                    <p>${leads[i].timestamp}</p>
                    <div>
                        <button onclick="editLead(${i})">Edit</button>
                        <button onclick="removeLead(${i})">Remove</button>
                    </div>
                </li>
            `
        }
    }
    ulEl.innerHTML = listItems
}

function editLead(index) {
    inputEl.value = myLeads[index].url
    editIndex = index
    inputBtn.style.display = "none"
    updateBtn.style.display = "inline"
}

function removeLead(index) {
    myLeads.splice(index, 1)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    render(myLeads)
}

deleteBtn.addEventListener("dblclick", function () {
    localStorage.clear()
    myLeads = []
    render(myLeads)
})

inputBtn.addEventListener("click", function () {
    const url = inputEl.value.trim()
    if (url !== "") {
        const timestamp = new Date().toLocaleString()
        const category = categoryEl.value
        myLeads.push({ url, timestamp, category })
        inputEl.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
    } else {
        alert("URL cannot be empty.")
    }
})

updateBtn.addEventListener("click", function () {
    const url = inputEl.value.trim()
    if (url !== "" && editIndex !== null) {
        myLeads[editIndex].url = url
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(myLeads)
        inputEl.value = ""
        inputBtn.style.display = "inline"
        updateBtn.style.display = "none"
        editIndex = null
    } else if (url === "") {
        alert("URL cannot be empty.")
    }
})

categoryEl.addEventListener("change", function () {
    render(myLeads)
})
