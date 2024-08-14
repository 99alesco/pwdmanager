const secretKey = 'mySecretKey'; // Replace with a strong, unique key

// Load stored passwords from localStorage when the page loads
window.onload = function() {
    checkPassword();
};

function checkPassword() {
    const storedPassword = localStorage.getItem('password');

    // Show login modal if no password is set
    if (!storedPassword) {
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('setPasswordButton').onclick = function() {
            const newPassword = document.getElementById('loginPassword').value;
            if (newPassword) {
                localStorage.setItem('password', encryptData(newPassword, secretKey));
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
            } else {
                alert('Please enter a password.');
            }
        };
    } else {
        // Prompt for password
        document.getElementById('loginPage').style.display = 'flex';
        document.getElementById('loginButton').onclick = function() {
            const userPassword = document.getElementById('loginPassword').value;
            if (userPassword === decryptData(storedPassword, secretKey)) {
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
                loadPasswords();
            } else {
                alert('Incorrect password. Please try again.');
            }
        };
    }
}

// Function to add a new password entry
document.getElementById('addButton').onclick = function() {
    addPassword();
};

function addPassword() {
    const site = document.getElementById('site').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (site && username && password) {
        const passwordEntry = {
            site: encryptData(site, secretKey),
            username: encryptData(username, secretKey),
            password: encryptData(password, secretKey)
        };

        let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
        passwords.push(passwordEntry);
        localStorage.setItem('passwords', JSON.stringify(passwords));

        addPasswordToTable(passwordEntry);
        clearInputFields();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to load passwords from localStorage and display them in the table
function loadPasswords() {
    const passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    passwords.forEach(passwordEntry => {
        addPasswordToTable(passwordEntry);
    });
}

// Function to add a password entry to the table
function addPasswordToTable(passwordEntry) {
    const table = document.getElementById('passwordTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    cell1.textContent = decryptData(passwordEntry.site, secretKey);
    cell2.textContent = decryptData(passwordEntry.username, secretKey);
    cell3.textContent = '********'; // Initially hide the password

    // Create a button to show/hide the password
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show';
    toggleButton.onclick = function() {
        if (cell3.textContent === '********') {
            cell3.textContent = decryptData(passwordEntry.password, secretKey); // Show the password
            toggleButton.textContent = 'Hide';
        } else {
            cell3.textContent = '********'; // Hide the password
            toggleButton.textContent = 'Show';
        }
    };
    cell4.appendChild(toggleButton);

    // Create the delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.onclick = function() {
        deletePassword(newRow.rowIndex - 1);
    };
    cell4.appendChild(deleteButton);
}

// Function to delete a password entry
function deletePassword(index) {
    let passwords = JSON.parse(localStorage.getItem('passwords')) || [];
    passwords.splice(index, 1);
    localStorage.setItem('passwords', JSON.stringify(passwords));
    reloadTable();
}

// Function to reload the table after deletion
function reloadTable() {
    const tableBody = document.getElementById('passwordTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the table
    loadPasswords(); // Reload passwords
}

// Function to clear input fields after adding a password
function clearInputFields() {
    document.getElementById('site').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// Encryption function
function encryptData(data, secretKey) {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Decryption function
function decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}
