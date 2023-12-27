document.addEventListener('DOMContentLoaded', function () {
    fetchClasses();
    fetchStudents();
});

function fetchClasses() {
    fetch('http://localhost:8000/class')
        .then(response => response.json())
        .then(classes => {
            const tbody = document.querySelector('#classTable tbody');
            tbody.innerHTML = '';
            classes.forEach(classe => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${classe.id}</td>
                    <td>${classe.name}</td>
                    <td>${classe.level}</td>
                    <td>
                        <button class="btn btn-primary" onclick="openEditFormClass(${classe.id}, '${classe.name}', '${classe.level}')">Modifier</button>
                        <button class="btn btn-danger" onclick="deleteClass(${classe.id})">Supprimer</button>
                    </td>`;
                tbody.appendChild(tr);
            });
        });
}

function fetchStudents() {
    fetch('http://localhost:8000/students')
        .then(response => response.json())
        .then(students => {
            const tbody = document.querySelector('#studentTable tbody');
            tbody.innerHTML = '';
            students.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${student.id}</td>
                    <td>${student.lastname}</td>
                    <td>${student.firstname}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${student.address}</td>
                    <td>${student.zip}</td>
                    <td>${student.city}</td>
                    <td>${student.class}</td>
                    <td>
                        <button class="btn btn-primary" onclick='openEditFormStudent(${JSON.stringify(JSON.stringify(student))})'>Modifier</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Supprimer</button>
                    </td>`;
                tbody.appendChild(tr);
            });
        });
}

function deleteClass(classId) {
    console.log(classId);
    fetch(`http://localhost:8000/class/${classId}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok) {
                fetchClasses();
            }
        });
}

function deleteStudent(studentId) {

    fetch(`http://localhost:8000/students/${studentId}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok) {
                fetchStudents();
            }
        });
}


function openEditFormClass(id, name, level) {
    document.getElementById('editClassName').value = name;
    document.getElementById('editClassLevel').value = level;
    document.getElementById('formEditClass').dataset.classId = id;
    $('#editClassModal').modal('show');
}

function openEditFormStudent(studentData) {
    const student = JSON.parse(studentData);
    document.getElementById('editStudentLastname').value = student.lastname;
    document.getElementById('editStudentFirstname').value = student.firstname;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentPhone').value = student.phone;
    document.getElementById('editStudentAddress').value = student.address;
    document.getElementById('editStudentZip').value = student.zip;
    document.getElementById('editStudentCity').value = student.city;
    document.getElementById('editStudentClass').value = student.class;
    document.getElementById('formEditStudent').dataset.studentId = student.id;
    $('#editStudentModal').modal('show');
}


document.getElementById('formEditClass').addEventListener('submit', function (e) {
    e.preventDefault();
    const classId = this.dataset.classId;
    const name = document.getElementById('editClassName').value;
    const level = document.getElementById('editClassLevel').value;

    fetch(`http://localhost:8000/class/${classId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, level})
    }).then(response => {
        if (response.ok) {
            fetchClasses();
            $('#editClassModal').modal('hide');
        }
    });
});


document.getElementById('formEditStudent').addEventListener('submit', function (e) {
    e.preventDefault();
    const studentId = this.dataset.studentId;
    const lastname = document.getElementById('editStudentLastname').value;
    const firstname = document.getElementById('editStudentFirstname').value;
    const email = document.getElementById('editStudentEmail').value;
    const phone = document.getElementById('editStudentPhone').value;
    const address = document.getElementById('editStudentAddress').value;
    const zip = document.getElementById('editStudentZip').value;
    const city = document.getElementById('editStudentCity').value;
    const classe = document.getElementById('editStudentClass').value;

    fetch(`http://localhost:8000/students/${studentId}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lastname, firstname, email, phone, address, zip, city, classe})
    }).then(response => {
        if (response.ok) {
            fetchStudents();
            $('#editStudentModal').modal('hide');
        } else {
            response.json().then(data => {
                console.error('Erreur lors de la mise à jour de l\'étudiant:', data);
                alert('Erreur lors de la mise à jour: ' + data.message); // Affiche un message d'erreur
            });
        }
    }).catch(error => {
        console.error('Erreur réseau:', error);
        alert('Une erreur réseau est survenue'); // Gestion des erreurs réseau
    });
});


document.getElementById('formAddClass').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('addClassName').value;
    const level = document.getElementById('addClassLevel').value;

    fetch('http://localhost:8000/class', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, level})
    }).then(response => {
        if (response.ok) {
            fetchClasses();
            $('#addClassModal').modal('hide'); // Fermez le modal
        }
        console.log(response)
    });
});

document.getElementById('formAddStudent').addEventListener('submit', function (e) {
    e.preventDefault();
    const lastname = document.getElementById('addStudentLastname').value;
    const firstname = document.getElementById('addStudentFirstname').value;
    const email = document.getElementById('addStudentEmail').value;
    const phone = document.getElementById('addStudentPhone').value;
    const address = document.getElementById('addStudentAddress').value;
    const zip = document.getElementById('addStudentZip').value;
    const city = document.getElementById('addStudentCity').value;
    const classe = document.getElementById('addStudentClass').value;

    fetch('http://localhost:8000/students', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lastname, firstname, email, phone, address, zip, city, class: classe})
    }).then(response => {
        if (response.ok) {
            fetchStudents(); // Mettre à jour la liste des étudiants
            $('#addStudentModal').modal('hide'); // Fermer le modal
        }
    });
});

