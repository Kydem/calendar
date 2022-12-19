const userListing = document.querySelector(".user-listing");

fetch("/users")
.then((res) => res.json())
.then((users) => {
    for (let user of users) {
        const div = document.createElement("div");
        div.textContent = `${data.name}`;
        console.log(data);
    };
});

const createUser = document.querySelector(".create-user");