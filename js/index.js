document.addEventListener("DOMContentLoaded", function() {
    renderList()
});

function renderList(){
    fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => data.forEach(element => {
        const li = document.createElement('li')
        li.textContent = element.title
        li.id = element.id
        li.addEventListener('click', displayBook)
        document.getElementById('list').appendChild(li)
    }))
}

function displayBook(e){
    document.getElementById('show-panel').innerHTML = ''
    fetch(`http://localhost:3000/books/${e.target.id}`)
    .then(res => res.json())
    .then(data => {
        const img = document.createElement('img')
        const title = document.createElement('h2')
        const subtitle = document.createElement('h3')
        const author = document.createElement('h3')
        const desc = document.createElement('p')
        const userList = document.createElement('ul')
        const button = document.createElement('button')
        button.id = e.target.id
        
        button.addEventListener('click', handleLike)

        img.src = data.img_url
        title.textContent = data.title
        subtitle.textContent = data.subtitle
        author.textContent = data.author
        desc.textContent = data.description
        button.textContent = 'Like'

        data.users.forEach(element => {
            if (element.id === 1){
                button.textContent = 'Unlike'
            }
        })

        data.users.forEach(element => {
            const li = document.createElement('li')
            li.id = element.id
            li.textContent = element.username
            userList.appendChild(li)
        })


        document.getElementById('show-panel').append(img, title, subtitle, author, desc, userList, button)

    })
}

function handleLike(e){
    e.preventDefault()
    fetch(`http://localhost:3000/books/${e.target.id}`)
    .then(res => res.json())
    .then(data => {
        if (e.target.innerText === 'Like'){
            fetch(`http://localhost:3000/users/1`)
            .then(res => res.json())
            .then(data1 => {
                const updatedBook = {...data}
                updatedBook.users.push(data1)
                fetch(`http://localhost:3000/books/${e.target.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify(updatedBook)
                })
                .then(res => res.json())
                .then(data2 => displayBook(e))
            })
        }
        

    })
}