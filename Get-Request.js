const usersContainer = document.querySelector('#wrap-users');
const deleteModal = document.querySelector('#delete-modal');

let userID = null;

// ===============================
// GET USERS
// ===============================

window.addEventListener('load', () => {

fetch('https://dummyjson.com/users')
    .then(res => {

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        return res.json();
    })
    .then(data => {

        data.users.forEach(user => {

            usersContainer.insertAdjacentHTML(
                'beforeend',

                `
                <div class="user" id="user-${user.id}">

                    <div class="user-profile-wrap">

                        <img
                            class="user-profile"
                            src="https://i.pravatar.cc/150?img=${user.id}"
                            alt="default-image"
                        >

                        <div class="user-profile-description">

                            <h1 class="user-profile-name">
                                ${user.firstName} - ${user.lastName}

                                <span class="user-age">
                                    ${user.age}
                                </span>
                            </h1>

                            <h3 class="user-explanations">
                                Pass: ${user.password}
                            </h3>

                        </div>

                    </div>


                    <div>

                        <button
                            class="delete-user-btn"
                            onclick="openDeleteModal(${user.id})"
                        >
                            delete
                        </button>

                        <button class="edit-user-btn">
                            edit
                        </button>

                    </div>

                </div>
                `
            );

        });

    })
    .catch(error => {

        console.error('Error fetching users:', error);

    });


});

// ===============================
// OPEN DELETE MODAL
// ===============================

function openDeleteModal(id) {

userID = id;

deleteModal.classList.add('visible');


}

// ===============================
// CLOSE DELETE MODAL
// ===============================

function closeModal() {

deleteModal.classList.remove('visible');

userID = null;


}

// ===============================
// DELETE USER
// ===============================

function deleteUser() {

if (userID === null) {
    return;
}


fetch(`https://dummyjson.com/users/${userID}`, {

    method: 'DELETE'

})

    .then(res => {

        if (!res.ok) {
            throw new Error('Delete request failed');
        }

        return res.json();

    })

    .then(data => {

        console.log('User deleted:', data);


        const userElement = document.querySelector(
            `#user-${userID}`
        );


        if (userElement) {
            userElement.remove();
        }


        closeModal();

    })

    .catch(error => {

        console.error('Error deleting user:', error);

        closeModal();

    });


}