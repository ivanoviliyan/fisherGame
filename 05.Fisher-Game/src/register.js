const checkSessionStorage = () => {
  const isAccessToken = Boolean(sessionStorage.getItem('accessToken'));
  return isAccessToken;
}

const register = async (userData) => {
  const registerRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };

  const url = "http://localhost:3030/users/register";

  try {
    const response = await fetch(url, registerRequest);
    const data = await response.json()
    if (!response.ok) {
      alert(data.message);
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

const collectRegisterData = () => {
  const email = document.querySelector('input[name="email"]');
  const password = document.querySelector('input[name="password"]');
  const repeat = document.querySelector('input[name="rePass"]');

  const errorMessage = () => {
    alert("invalid username/password");
    email.value = "";
    password.value = "";
    repeat.value = "";
  };

  if (password.value != repeat.value) {
    errorMessage();
    return;
  }
  if (!password.value || !repeat.value || !email.value) {
    errorMessage();
    return;
  }

  return {
    email: email.value,
    password: password.value,
  };
};

const regBtn = document.querySelector("#register > button");
regBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const userData = collectRegisterData();
  if (userData) {
    try {
        const data = await register(userData);
        console.log(data);
         if (userData.code) alert(userData.message);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("id", data._id);
        location.href = "./index.html";
      } catch (error) {
        console.error(error);
      }
}
});

checkSessionStorage() ? document.querySelector('#logout').style.display = 'none' : 'inline-block';

if (!checkSessionStorage()) {
  document.querySelector('#logout').style.display = 'none';
}