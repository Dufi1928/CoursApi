document.addEventListener('DOMContentLoaded', function() {
    fetchClasses();
    fetchStudents();
});

function fetchClasses() {
    fetch('http://localhost:8000/class')
        .then(response => {
            if (!response.ok) {
                throw new Error('Réponse réseau non OK pour les classes');
            }
            return response.json();
        })
        .then(classes => {
            const classTableBody = document.querySelector('#class-table tbody');
            classTableBody.innerHTML = ''; // Effacer les anciennes données
            classes.forEach(classe => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${classe.id}</td>
                    <td>${classe.name}</td>
                    <td>${classe.level}</td>
                    <td>
                        <button onclick="editClass('${classe.id}')">Modifier</button>
                        <button onclick="deleteClass('${classe.id}')">Supprimer</button>
                    </td>
                `;
                classTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des classes:', error));
}
function fetchStudents() {
    fetch('http://localhost:8000/students')
        .then(response => {
            if (!response.ok) {
                throw new Error('Réponse réseau non OK pour les étudiants');
            }
            return response.json();
        })
        .then(students => {
            const studentTableBody = document.querySelector('#student-table tbody');
            studentTableBody.innerHTML = ''; // Effacer les anciennes données
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.firstname}</td>
                    <td>${student.lastname}</td>
                    <td>${student.email}</td>
                    <td>
                        <button onclick="editStudent('${student.id}')">Modifier</button>
                        <button onclick="deleteStudent('${student.id}')">Supprimer</button>
                    </td>
                    <!-- Ajoutez d'autres cellules ici si nécessaire -->
                `;
                studentTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des étudiants:', error));
}
function deleteStudent(studentId) {
    fetch(`http://localhost:8000/students/${studentId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Problème lors de la suppression de l’étudiant');
            }
            fetchStudents();
        })
        .catch(error => console.error('Erreur lors de la suppression:', error));
}

function deleteClass(classId) {
    fetch(`http://localhost:8000/class/${classId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Problème lors de la suppression de l’étudiant');
            }
            fetchClasses()
        })
        .catch(error => console.error('Erreur lors de la suppression:', error));
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Ajoutez des écouteurs d'événements pour les soumissions de formulaire ici
document.getElementById('edit-class-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Ici, code pour envoyer les données modifiées de la classe
});

function editStudent(studentId) {
    // Même processus que pour editClass
    document.getElementById('edit-student-id').value = studentId;
    document.getElementById('edit-student-firstname').value = 'Prénom';
    document.getElementById('edit-student-lastname').value = 'Nom';
    document.getElementById('edit-student-email').value = 'Email';

    document.getElementById('edit-student-popup').style.display = 'block';
}

function editClass(classId) {
    // Ici, récupérez les informations de la classe à modifier
    // Exemple : fetch(`http://localhost:8000/class/${classId}`)...

    // Après avoir récupéré les données, remplissez le formulaire
    document.getElementById('edit-class-id').value = classId;
    document.getElementById('edit-class-name').value = 'Nom de la classe'; // à remplacer
    document.getElementById('edit-class-level').value = 'Niveau de la classe'; // à remplacer

    // Affichez la popup
    document.getElementById('edit-class-popup').style.display = 'block';
}

    document.getElementById('edit-student-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // Ici, code pour envoyer les données modifiées de l'étudiant
    });