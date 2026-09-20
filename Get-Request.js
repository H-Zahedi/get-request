const usersContainer = document.querySelector('#wrap-users');

const deleteModal = document.querySelector('#delete-modal');
const editModal = document.querySelector('#edit-modal');

const editForm = document.querySelector('#edit-user-form');

const firstnameInput = document.querySelector('#firstname');
const lastnameInput = document.querySelector('#lastname');
const passwordInput = document.querySelector('#password');

const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#error-message');

// ID کاربری که قرار است حذف یا ویرایش شود
let userID = null;

// =====================================================
// GET ALL USERS
// =====================================================

function getAllUsers() {

loading.style.display = 'block';

errorMessage.textContent = '';

usersContainer.innerHTML = '';

fetch('https://dummyjson.com/users')

    .then(res => {

        if (!res.ok) {
            throw new Error('Failed to fetch users');
        }

        return res.json();

    })

    .then(data => {

        loading.style.display = 'none';

        data.users.forEach(user => {

            createUserCard(user);

        });

    })

    .catch(error => {

        loading.style.display = 'none';

        errorMessage.textContent =
            'Error loading users. Please try again.';

        console.error(
            'Error fetching users:',
            error
        );

    });


}

// =====================================================
// CREATE USER CARD
// =====================================================

function createUserCard(user) {

usersContainer.insertAdjacentHTML(

    'beforeend',

    `
    <div class="user" id="user-${user.id}">

        <div class="user-profile-wrap">

            <img
                class="user-profile"
                src="https://i.pravatar.cc/150?img=${user.id}"
                alt="User profile"
            >

            <div class="user-profile-description">

                <h1 class="user-profile-name">

                    ${user.firstName}
                    -
                    ${user.lastName}

                    <span class="user-age">
                        ${user.age}
                    </span>

                </h1>

                <h3 class="user-explanations">
                    Pass: ${user.password}
                </h3>

            </div>

        </div>


        <div class="user-buttons">

            <button
                class="delete-user-btn"
                onclick="openDeleteModal(${user.id})"
            >
                Delete
            </button>


            <button
                class="edit-user-btn"
                onclick="openEditModal(${user.id})"
            >
                Edit
            </button>

        </div>

    </div>
    `
);


}

// =====================================================
// OPEN DELETE MODAL
// =====================================================

function openDeleteModal(id) {

userID = id;

deleteModal.classList.add('visible');


}

// =====================================================
// CLOSE DELETE MODAL
// =====================================================

function closeDeleteModal() {

deleteModal.classList.remove('visible');

userID = null;


}

// =====================================================
// DELETE USER
// =====================================================

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

        console.log(
            'User deleted:',
            data
        );


        // حذف کارت از صفحه
        const userElement = document.querySelector(
            `#user-${userID}`
        );


        if (userElement) {

            userElement.remove();

        }


        closeDeleteModal();

    })

    .catch(error => {

        console.error(
            'Error deleting user:',
            error
        );

        closeDeleteModal();

    });


}

// =====================================================
// OPEN EDIT MODAL
// =====================================================

function openEditModal(id) {

userID = id;


// ابتدا اطلاعات کاربر را می‌گیریم
fetch(`https://dummyjson.com/users/${userID}`)

    .then(res => {

        if (!res.ok) {
            throw new Error(
                'Failed to fetch user information'
            );
        }

        return res.json();

    })

    .then(user => {

        // قرار دادن اطلاعات فعلی داخل input ها

        firstnameInput.value =
            user.firstName || '';

        lastnameInput.value =
            user.lastName || '';

        passwordInput.value =
            user.password || '';


        // نمایش modal

        editModal.classList.add('visible');

    })

    .catch(error => {

        console.error(
            'Error fetching user:',
            error
        );

    });


}

// =====================================================
// CLOSE EDIT MODAL
// =====================================================

function closeEditModal() {

editModal.classList.remove('visible');

userID = null;

editForm.reset();


}

// =====================================================
// UPDATE USER - PUT
// =====================================================

editForm.addEventListener(
'submit',
function (event) {

    // جلوگیری از refresh شدن صفحه
    event.preventDefault();


    if (userID === null) {

        console.error(
            'User ID is missing'
        );

        return;
    }


    // اطلاعات جدید کاربر

    const userData = {

        firstName: firstnameInput.value.trim(),

        lastName: lastnameInput.value.trim(),

        password: passwordInput.value

    };


    console.log(
        'Sending PUT request:',
        userData
    );


    // PUT REQUEST

    fetch(
        `https://dummyjson.com/users/${userID}`,

        {

            method: 'PUT',

            headers: {

                'Content-Type':
                    'application/json'

            },

            body: JSON.stringify(userData)

        }
    )

        .then(res => {

            if (!res.ok) {

                throw new Error(
                    'Update request failed'
                );

            }

            return res.json();

        })

        .then(updatedUser => {

            console.log(
                'User updated successfully:',
                updatedUser
            );


            // پیدا کردن کارت کاربر

            const userElement =
                document.querySelector(
                    `#user-${userID}`
                );


            if (userElement) {

                const nameElement =
                    userElement.querySelector(
                        '.user-profile-name'
                    );


                const passwordElement =
                    userElement.querySelector(
                        '.user-explanations'
                    );


                // تغییر نام در صفحه

                nameElement.innerHTML = `

                    ${updatedUser.firstName}
                    -
                    ${updatedUser.lastName}

                    <span class="user-age">
                        ${updatedUser.age}
                    </span>

                `;


                // تغییر password در صفحه

                passwordElement.textContent =
                    `Pass: ${updatedUser.password}`;

            }


            // بستن modal

            closeEditModal();

        })

        .catch(error => {

            console.error(
                'Error updating user:',
                error
            );

        });

}


);

// =====================================================
// START APPLICATION
// =====================================================

window.addEventListener(
'DOMContentLoaded',
getAllUsers
);