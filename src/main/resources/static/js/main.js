/**
 *
 */
$(document).ready(function () {






    document.querySelector("#submitEdit").addEventListener('click', function (event) {
        event.preventDefault();

        var role = [];
        if (document.querySelector("#userRole").checked) {
            role.push({
                "id": 1,
                "name": "ROLE_USER"
            });
        }
        if (document.querySelector("#adminRole").checked) {
            role.push({
                "id": 2,
                "name": "ROLE_ADMIN"
            });
        }

        fetch("api/admin/update", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": document.querySelector("#id").value,
                "username": document.querySelector("#username").value,
                "name": document.querySelector("#name").value,
                "age": document.querySelector("#age").value,
                "password": document.querySelector("#password").value,
                "email": document.querySelector("#email").value,
                "roles": role
            })
        })
            .then(response => response.text())
            .then(data => {
                if (data === "ok") {
                    console.log("User updated successfully");
                    $('#editModal').modal('hide');
                    updateUserList();

                } else {
                    console.log("Unexpected response: " + data);
                }
            })
            .catch(error => {
                console.log(error); // Обработка ошибки при необходимости
            });
    });


    $("#submitDelete").on('click', function (event) {
        event.preventDefault();
        console.log($("#id").val());
        fetch("api/admin/delete?id=" + $("#deleteId").val(), {
            method: "DELETE",
        })
            .then(response => response.text())
            .then(data => {
                if (data === "ok") {
                    console.log("User deleted successfully");
                    $('#deleteModal').modal('hide');
                    updateUserList();

                } else {
                    console.log("Unexpected response: " + data);
                    // Обработка неожиданного ответа при необходимости
                }
            })
            .catch(error => {
                console.log(error); // Обработка ошибки при необходимости
            });
    });


    console.log("парсим принципала для /user")
    fetch('/api/user')
        .then(response => response.json())
        .then(user => {
            // Update username
            document.getElementById('username').textContent = user.username;

            // Update roles
            const rolesElement = document.getElementById('roles');
            rolesElement.innerHTML = '';
            user.roles.forEach(role => {
                const roleElement = document.createElement('span');
                roleElement.textContent = role.name;
                rolesElement.appendChild(roleElement);
                rolesElement.appendChild(document.createElement('br'));
            });


            console.log("заполняем таблицу на /user")
            const userInfoElement = document.getElementById('user-info');
            userInfoElement.innerHTML = `
              <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>
                  ${user.roles.map(role => role.name).join('<br>')}
                </td>
              </tr>
            `;
        })
        .catch(error => console.error(error));


    console.log("парсим принципала для /admin")
    fetch('/api/user')
        .then(response => response.json())
        .then(user => {
            // Update username
            document.getElementById('username2').textContent = user.username;

            // Update roles
            const rolesElement2 = document.getElementById('roles2');
            rolesElement2.innerHTML = '';
            user.roles.forEach(role => {
                const roleElement2 = document.createElement('span');
                roleElement2.textContent = role.name;
                rolesElement2.appendChild(roleElement2);
                rolesElement2.appendChild(document.createElement('br'));
            });
        })


    console.log("заполняем таблицу на /admin")

    updateUserList();
    function updateUserList() {
        fetch('/api/admin')
            .then(response => response.json())
            .then(users => {
                const userInfoElement = document.getElementById('users-info2');
                userInfoElement.innerHTML = "";
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    console.log(users)
                    userInfoElement.innerHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>
                        ${user.roles.map(role => role.name).join('<br>')}
                    </td>
                    <td>
                        <a id="eBtn" class="btn btn-primary eBtn" href="api/admin/findOne/${user.id}">Edit</a>
                    </td>
                    <td>
                        <a class="btn btn-danger dBtn" href="api/admin/findOne/${user.id}">Delete</a>
                    </td>
                </tr>
            `;
                }

                // Отменить действие по умолчанию для кнопок eBtn и dBtn
                const deleteButtons = document.querySelectorAll('.dBtn');


                const editButtons = document.querySelectorAll('.eBtn');
                editButtons.forEach(button => {
                    button.addEventListener('click', event => {
                        event.preventDefault();


                        const href = button.getAttribute('href');
                        $.get(href, function (user, status) {
                            console.log(user);

                            $('#id').val(user.id);
                            $('#username').val(user.username);
                            $('#email').val(user.email);
                            $('#name').val(user.name);
                            $('#age').val(user.age);
                            // $('#password').val(user.password);

                            for (var i = 0; i < user.roles.length; i++) {
                                var role = user.roles[i];
                                console.log(user.roles)
                                if (role.name === 'ROLE_ADMIN') {
                                    $('#adminRole').prop('checked', true);
                                }
                                if (role.name === 'ROLE_USER') {
                                    $('#userRole').prop('checked', true);
                                }
                            }
                        });

                        $('.myForm #editModal').modal();
                    });
                });


                deleteButtons.forEach(button => {
                    button.addEventListener('click', event => {
                        event.preventDefault();


                        const href = button.getAttribute('href');
                        $.get(href, function (user, status) {
                            console.log(user);

                            $('#deleteId').val(user.id);
                            $('#deleteUsername').val(user.username);
                            $('#deleteEmail').val(user.email);
                            $('#deleteName').val(user.name);
                            $('#deleteAge').val(user.age);
                            // $('#password').val(user.password);

                            for (var i = 0; i < user.roles.length; i++) {
                                var role = user.roles[i];
                                console.log(user.roles)
                                if (role.name === 'ROLE_ADMIN') {
                                    $('#deleteAdminRole').prop('checked', true);
                                }
                                if (role.name === 'ROLE_USER') {
                                    $('#deleteUserRole').prop('checked', true);
                                }
                            }
                        });

                        $('.myDeleteForm #deleteModal').modal();
                    });
                });
            })
        $("#incrementAge").click(function () {
            var age = parseInt($("#age").val());
            $("#age").val(age + 1);
        });

        $("#decrementAge").click(function () {
            var age = parseInt($("#age").val());
            if (age > 0) {
                $("#age").val(age - 1);
            }
        });
    }


})

