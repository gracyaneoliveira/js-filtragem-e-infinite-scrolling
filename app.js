const postsContainer = document.querySelector('#posts-container')
const loaderContainer = document.querySelector('.loader')
const filterInput = document.querySelector('#filter')

let page = 1

const getPosts = async () => {
    const response = await 
        fetch(`https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`)
    return response.json()
}

const generatePostsTemplate = posts => posts.map(({id, title, body}) => `
    <div class="post">
        <div class="number">${id}</div>
        <div class="post-info">
            <h2 class="post-title">${title}</h2>
            <p class="post-body">${body}</p>
        </div>
    </div>

    `).join('')

const addPostsIntoDOM = async () => {
    const posts = await getPosts()
    const postsTemplate = generatePostsTemplate(posts)

    postsContainer.innerHTML += postsTemplate 
}

const getNextPosts = () => {
    setTimeout(() => {
        page++;
    addPostsIntoDOM()
    }, 300)
}

const removeLoader = () => {
    setTimeout(() => {
        loaderContainer.classList.remove('show')
        getNextPosts()
    }, 1000)
}

const showLoader = () => {
    loaderContainer.classList.add('show')
    removeLoader()
}

const handleScrollToPageBottom = () => {
    const { clientHeight, scrollHeight, scrollTop} = document.documentElement
    const isPageBottomalmostReached = scrollTop + clientHeight >= scrollHeight - 10

    if(isPageBottomalmostReached) {
        showLoader()
    }
}

const showPostThatMatchInputValue = inputValue => post => {
    const postTitle = post.querySelector('.post-title').textContent.toLowerCase()
    const postBody = post.querySelector('.post-body').textContent.toLowerCase()
    const postContainsInoutValue = postTitle.includes(inputValue) 
        || postBody.includes(inputValue)

    if(postContainsInoutValue) {
       post.style.display = 'flex'
       return
    }

    post.style.display = 'none'
}

const handleInputValue = event => {
    const inputValue = event.target.value.toLowerCase()
    const posts = document.querySelectorAll('.post')
    
    posts.forEach(showPostThatMatchInputValue(inputValue))
}

addPostsIntoDOM()

window.addEventListener('scroll', handleScrollToPageBottom)
filterInput.addEventListener('input', handleInputValue)