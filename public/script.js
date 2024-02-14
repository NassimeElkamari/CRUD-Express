// Function to fetch user data from server and populate the table
function fetchAndPopulateUsers() {
    fetch('/items')
    .then(response => response.json())
    .then(data => {
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = ''; 
        data.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><button class="updateBtn" data-id="${user.id}" data-name="${user.name}" data-email="${user.email}">Update</button></td>
                </tr>
            `;
            userTableBody.innerHTML += row;
        });
    })
    .catch(error => console.error('Error:', error));
    }


    // Function to update form fields for user update
    function updateFormForUser(userId, userName, userEmail) {
        document.getElementById('name').value = userName;
        document.getElementById('email').value = userEmail;
        document.getElementById('submitButton').textContent = 'Update User';
        document.getElementById('addUserForm').removeEventListener('submit', addUserHandler); 
        document.getElementById('addUserForm').addEventListener('submit', function(updateEvent) {
            updateEvent.preventDefault(); 
            const updatedName = document.getElementById('name').value;
            const updatedEmail = document.getElementById('email').value;
            fetch(`/items/${userId}`, {
                method: 'PATCH',
                body: JSON.stringify({ name: updatedName, email: updatedEmail }),
                headers: {
                    'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('User updated successfully');
                    fetchAndPopulateUsers();
                } else {
                    throw new Error('Failed to update user');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update user');
            });
        });
    }

    // Event listener for adding a new user
    function addUserHandler(event) {
        event.preventDefault(); // Prevent default form submission
        const formData = new FormData(this);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
    })
    .then(response => {
        if (response.ok) {
            alert('User added successfully');
            fetchAndPopulateUsers();
        } else {
            throw new Error('Failed to add user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add user');
    });
    }

    document.getElementById('addUserForm').addEventListener('submit', addUserHandler); // Attach event listener for adding user

    // Event listener for Update buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('updateBtn')) {
            const userId = event.target.getAttribute('data-id');
            const userName = event.target.getAttribute('data-name');
            const userEmail = event.target.getAttribute('data-email');
            updateFormForUser(userId, userName, userEmail);
        }
    });

// Initial population of user data
fetchAndPopulateUsers();
