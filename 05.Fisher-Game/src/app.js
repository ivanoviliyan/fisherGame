const checkSessionStorage = () => {
    const isAccessToken = Boolean(sessionStorage.getItem("accessToken"));
    return isAccessToken;
};

const sessionStorageOwnerId = sessionStorage.getItem("id");

if (checkSessionStorage()) {
    document.querySelector("body > header > nav > p > span").textContent =
        sessionStorage.getItem("email");
    document.querySelector(".add").disabled = false;
}
if (!checkSessionStorage()) {
    document.querySelector("#logout").style.display = "none";
}

const collectCatchData = () => {
    const form = document.querySelector("#addForm");
    const formData = new FormData(form);
    const body = {};

    for (const [key, value] of formData.entries()) {
        body[key] = value;
    }

    return body;
};

const postCatch = async (data) => {
    const url = "http://localhost:3030/data/catches";
    const request = {
        method: "POST",
        headers: {
            "X-Authorization": sessionStorage.getItem("accessToken"),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(url, request);
        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.log(error);
    }
};

document.querySelector(".add").addEventListener("click", (e) => {
    e.preventDefault();
    postCatch(collectCatchData());
    getAllCatches();
});

const logout = async () => {
    const url = "http://localhost:3030/users/logout";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "X-Authorization": sessionStorage.getItem("accessToken") },
        });
        if (response.status === 204) {
            sessionStorage.clear();
            location.href = "./index.html";
        }
    } catch (error) {
        console.error(error);
    }
};

if (checkSessionStorage()) {
    document.querySelector("#login").style.display = "none";
    document.querySelector("#register").style.display = "none";
}

document.querySelector("#logout").addEventListener("click", () => logout());

const createCatchDiv = (
    anglerValue,
    weightValue,
    speciesValue,
    locationValue,
    baitValue,
    captureTimeValue,
    ownerId,
    id
) => {
    const div = document.createElement("div");
    div.classList.add("catch");

    const createInput = (type, className, valueText) => {
        const input = document.createElement("input");
        input.type = type;
        input.classList.add(className);
        input.value = valueText;
        input.disabled = true;
        return input;
    };

    const createLabel = (text) => {
        const label = document.createElement("label");
        label.textContent = text;
        return label;
    };

    const createButton = (text, className, dataId) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.classList.add(className);
        button.setAttribute("data-id", dataId);
        button.id = id;
        button.disabled = dataId !== sessionStorageOwnerId;
        return button;
    };

    const labelAngler = createLabel("Angler");
    const inputAngler = createInput("text", "angler", anglerValue);
    const labelWeight = createLabel("Weight");
    const inputWeight = createInput("text", "weight", weightValue);
    const labelSpecies = createLabel("Species");
    const inputSpecies = createInput("text", "species", speciesValue);
    const labelLocation = createLabel("Location");
    const inputLocation = createInput("text", "location", locationValue);
    const labelBait = createLabel("Bait");
    const inputBait = createInput("text", "bait", baitValue);
    const labelCaptureTime = createLabel("Capture Time");
    const inputCaptureTime = createInput("number", "captureTime", captureTimeValue);
    const updateBtn = createButton("Update", "update", ownerId);
    updateBtn.addEventListener("click", (e) => {
        console.log(e.target);
    });
    const deleteBtn = createButton("Delete", "delete", ownerId);
    deleteBtn.addEventListener("click", async (e) => {
        const url = `http://localhost:3030/data/catches/${e.target.id}`;
        console.log(sessionStorage.getItem("accessToken"));
        console.log(url);

        const request = {
            method: "DELETE",
            headers: { "X-Authorization": sessionStorage.getItem("accessToken") },
        };



        const response = await fetch(url, request);
        if (response.ok) {
            e.target.parentElement.remove();
        }
        const data = await response.json();
        console.log(data);
    });

    [
        labelAngler,
        inputAngler,
        labelWeight,
        inputWeight,
        labelSpecies,
        inputSpecies,
        labelLocation,
        inputLocation,
        labelBait,
        inputBait,
        labelCaptureTime,
        inputCaptureTime,
        updateBtn,
        deleteBtn,
    ].forEach((el) => {
        div.appendChild(el);
    });

    return div;
};

const getAllCatches = async () => {
    const url = "http://localhost:3030/data/catches";

    const request = {
        method: "GET",
        headers: { "X-Authorization": sessionStorage.getItem("accessToken") },
    };

    const response = await fetch(url, request);
    const data = await response.json();
    document.querySelector("#catches").replaceChildren();
    Object.entries(data).forEach(([n, data]) => {
        console.log(data);
        const catchDiv = createCatchDiv(
            data.angler,
            data.weight,
            data.species,
            data.location,
            data.bait,
            data.captureTime,
            data._ownerId,
            data._id
        );
        document.querySelector("#catches").appendChild(catchDiv);
    });
};

document.querySelector(".load").addEventListener("click", async () => {
    if (!checkSessionStorage()) return;

    getAllCatches();
});
