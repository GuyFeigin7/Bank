// Show the Signup Form
document.getElementById('signupButton').addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
});

// Show the Signin Form
document.getElementById('signinButton').addEventListener('click', () => {
  document.getElementById('home').style.display = 'none';
  document.getElementById('signinForm').style.display = 'block';
});

// Back Buttons for Signup and Signin Forms
document.querySelectorAll('.backButton').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('signinForm').style.display = 'none';
    document.getElementById('home').style.display = 'block';
  });
});

// Handle Signup Form Submission
document.getElementById('signup').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('password').value;
  const phone = document.getElementById('phone').value;
  const errorMessage = document.getElementById('signupErrorMessage');

  try {
    const response = await fetch('http://10.10.1.194:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name, password, phone })
    });

    const data = await response.json();

    if (data.success) {
      alert('Signup successful! Redirecting to Signin.');
      window.location.href = '/signin';
    } else {
      errorMessage.textContent = data.message || 'Signup failed.';
    }
  } catch (err) {
    errorMessage.textContent = 'Error: Unable to connect to the server.';
  }
});

// Handle Signin Form Submission
document.getElementById('signin').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;
  const errorMessage = document.getElementById('signinErrorMessage');

  try {
    const response = await fetch('http://10.10.1.194:3000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Decode the token to get user name (optional: you can decode on the frontend)
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      
      // Show welcome page
      document.getElementById('signinForm').style.display = 'none';
      document.getElementById('welcomePage').style.display = 'block';
      document.getElementById('welcomeMessage').textContent = `Hello, ${payload.name}!`;
    } else {
      errorMessage.textContent = data.message || 'Signin failed.';
    }
  } catch (err) {
    errorMessage.textContent = 'Error: Unable to connect to the server.';
  }
});

// Handle Logout Button
document.getElementById('logoutButton').addEventListener('click', () => {
  // Clear the token from localStorage
  localStorage.removeItem('token');

  // Show the home page and hide the welcome page
  document.getElementById('welcomePage').style.display = 'none';
  document.getElementById('home').style.display = 'block';
});

// Handle View Transactions Button
const transactionsDiv = document.getElementById("transactionsPage");
document.getElementById('viewTransactionsButton').addEventListener('click', async function () {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('You are not authorized. Please sign in.');
    return;
  }

  try {
    const response = await fetch('http://10.10.1.194:3000/transactions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the token in the Authorization header
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions;

      // Clear any previous content in the dashboard
      transactionsDiv.innerHTML = ``;

      // Create table element
      const table = document.createElement('table');
      table.setAttribute('border', '1');
      table.style.width = '100%';

      // Create the table header
      const header = table.createTHead();
      const headerRow = header.insertRow(0);
      const headers = ['From', 'To', 'Amount'];

      headers.forEach((headerText) => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
      });

      // Create the table body and populate it with transaction data
      const tbody = table.createTBody();

      transactions.forEach((transaction) => {
        const row = tbody.insertRow();

        const fromCell = row.insertCell(0);
        fromCell.textContent = transaction.from;

        const toCell = row.insertCell(1);
        toCell.textContent = transaction.to;

        const amountCell = row.insertCell(2);
        amountCell.textContent = transaction.amount;
      });

      // Append the table to the dashboard
      transactionsDiv.appendChild(table);
    } else {
      alert('Failed to fetch transactions.');
    }
  } catch (error) {
    alert('Error connecting to the server.');
  }

    
});
