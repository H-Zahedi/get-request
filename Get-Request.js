const usersContainer = document.querySelector('#wrap-users')

window.addEventListener('load', () => {
    fetch('https://dummyjson.com/users')
    .then(res => res.json())
    .then(data => {
        data.users.forEach(user => {
            usersContainer.insertAdjacentHTML('beforeend',
            `<div class="user">
            <div class="user-profile-wrap">
                <img class="user-profile" src="https://i.pravatar.cc/150?img=${user.id}" alt="default-image">
                <div class="user-profile-description">
                    <h1 class="user-profile-name">
                        ${user.firstName} - ${user.lastName} <span class="user-age">${user.age}</span>
                    </h1>
                    <h3 class="user-explanations">
                        Pass: ${user.password}
                    </h3>

                </div>
            </div>

            <div>
                <button class="delete-user-btn">delete</button>
                <button class="edit-user-btn">edit</button>
            </div>

        </div>`
        )
        })
    })
})