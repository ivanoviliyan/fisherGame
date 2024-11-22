const checkSessionStorage = () => {
  const isAccessToken = Boolean(sessionStorage.getItem('accessToken'));
  return isAccessToken;
}

const login = async (userData) => {
    const loginRequest = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    };

    const url = "http://localhost:3030/users/login";

    try {
        const res = await fetch(url, loginRequest);
        const data = await res.json()
        return data;
    } catch (error) {
        console.error(error);
    }
};

const collectLoginData = () => {
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
  
    const errorMessage = () => {
      alert("invalid username/password");
      email.value = "";
      password.value = "";
    };
  
    if (!password.value || !email.value) {
      errorMessage();
      return;
    }
  
    return {
      email: email.value,
      password: password.value,
    };
  };

document.querySelector('#login > button').addEventListener('click', async (e) => {
    e.preventDefault();
    const userData = collectLoginData();
    if (userData) {
        try {
            const data = await login(userData);
            console.log(data);
            sessionStorage.setItem("email", data.email);
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("id", data._id);
            location.href = "./index.html";
          } catch (error) {
            console.error(error);
          }
    }
})


if (!checkSessionStorage()) {
  document.querySelector("#logout").style.display = "none";
}